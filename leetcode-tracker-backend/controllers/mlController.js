const axios = require('axios');
const ActivityLog = require('../models/ActivityLog');

exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.sub;
        
        // Fetch all activities for the user
        const activities = await ActivityLog.find({ userId });
        
        if (!activities || activities.length === 0) {
            return res.json({ 
                message: "No data available yet",
                readinessScore: 0,
                weakTopics: [],
                recommendations: []
            });
        }
        
        // Calculate aggregate user stats
        const acceptedActivities = activities.filter(a => a.accepted);
        const accuracy = acceptedActivities.length / activities.length;
        
        const failedActivities = activities.filter(a => !a.accepted);
        const errorRate = failedActivities.length / activities.length;
        
        const coverage = Math.min(1.0, acceptedActivities.length / 50.0);
        const consistency = accuracy; // Mock consistency
        
        const hardActivities = activities.filter(a => a.difficulty === 'Hard');
        const hardRatio = activities.length > 0 ? hardActivities.length / activities.length : 0;
        
        const userStats = {
            accuracy,
            coverage,
            consistency,
            hard_ratio: hardRatio,
            error_rate: errorRate
        };
        
        // Call Python ML Service for Readiness
        let readinessScore = 0;
        try {
            const readyResponse = await axios.post('http://localhost:8000/predict/readiness', userStats);
            readinessScore = readyResponse.data.readiness_score;
        } catch (mlErr) {
            console.error("ML Service Error (Readiness):", mlErr.message);
        }
        
        // Calculate aggregate stats per topic
        const topicMap = {};
        activities.forEach(a => {
            const t = a.topic && a.topic.length > 0 ? a.topic[0] : 'Unknown';
            if (!topicMap[t]) {
                topicMap[t] = { count: 0, acceptedCount: 0, totalTime: 0, totalAttempts: 0, totalFailed: 0 };
            }
            topicMap[t].count++;
            if (a.accepted) topicMap[t].acceptedCount++;
            else topicMap[t].totalFailed++;
            topicMap[t].totalTime += (a.timeSpent || 0);
            topicMap[t].totalAttempts += (a.attempts || 1);
        });
        
        const topicStatsList = Object.keys(topicMap).map(t => {
            const data = topicMap[t];
            return {
                topic: t,
                accuracy: data.acceptedCount / data.count,
                avg_time: data.totalTime / data.count,
                attempts: data.totalAttempts,
                error_rate: data.totalFailed / data.count
            };
        });
        
        // Call Python ML Service for Weaknesses
        let weakTopics = [];
        try {
            if (topicStatsList.length > 0) {
                const weakResponse = await axios.post('http://localhost:8000/predict/weakness', topicStatsList);
                weakTopics = weakResponse.data.weak_topics || [];
            }
        } catch (mlErr) {
            console.error("ML Service Error (Weakness):", mlErr.message);
        }
        
        // Call Python ML Service for Recommendations based on Weaknesses
        let recommendations = [];
        if (weakTopics.length > 0) {
            try {
                const recResponse = await axios.post('http://localhost:8000/recommend', weakTopics);
                recommendations = recResponse.data.recommendations || [];
            } catch (mlErr) {
                console.error("ML Service Error (Recommendations):", mlErr.message);
            }
        }
        
        res.json({
            readinessScore,
            weakTopics,
            recommendations,
            userStats,
            topicStats: topicStatsList
        });

    } catch (err) {
        console.error("Error in getAnalytics:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
