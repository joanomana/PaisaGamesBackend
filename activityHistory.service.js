import ActivityHistory, { ACTIVITY_TYPES } from '../models/ActivityHistory.js';
import mongoose from 'mongoose';

class ActivityHistoryService {
    /**
     * Registra una nueva actividad en el historial
     * @param {Object} activityData - Datos de la actividad
     * @param {string} activityData.userId - ID del usuario
     * @param {string} activityData.activityType - Tipo de actividad
     * @param {string} activityData.description - Descripción de la actividad
     * @param {string} activityData.entityType - Tipo de entidad afectada
     * @param {string} activityData.entityId - ID de la entidad afectada
     * @param {Object} activityData.metadata - Metadata adicional
     * @param {string} activityData.ipAddress - Dirección IP del usuario
     * @param {string} activityData.userAgent - User agent del navegador
     * @param {Object} session - Sesión de MongoDB (opcional)
     */
    static async logActivity(activityData, session = null) {
        try {
            const activity = new ActivityHistory(activityData);
            
            if (session) {
                await activity.save({ session });
            } else {
                await activity.save();
            }
            
            return activity;
        } catch (error) {
            console.error('Error logging activity:', error);
            // No lanzamos error para evitar interrumpir el flujo principal
            return null;
        }
    }

    /**
     * Obtiene el historial de actividades de un usuario con filtros
     * @param {string} userId - ID del usuario
     * @param {Object} filters - Filtros de búsqueda
     * @param {number} page - Página actual
     * @param {number} limit - Límite de registros por página
     */
    static async getUserActivityHistory(userId, filters = {}, page = 1, limit = 20) {
        try {
            const query = { userId: new mongoose.Types.ObjectId(userId) };

            // Filtro por tipo de actividad
            if (filters.activityType && ACTIVITY_TYPES.includes(filters.activityType)) {
                query.activityType = filters.activityType;
            }

            // Filtro por rango de fechas
            if (filters.startDate || filters.endDate) {
                query.createdAt = {};
                if (filters.startDate) {
                    query.createdAt.$gte = new Date(filters.startDate);
                }
                if (filters.endDate) {
                    const endDate = new Date(filters.endDate);
                    endDate.setHours(23, 59, 59, 999); // Fin del día
                    query.createdAt.$lte = endDate;
                }
            }

            // Filtro por tipo de entidad
            if (filters.entityType) {
                query.entityType = filters.entityType;
            }

            const skip = (page - 1) * limit;

            const [activities, totalCount] = await Promise.all([
                ActivityHistory.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                ActivityHistory.countDocuments(query)
            ]);

            const totalPages = Math.ceil(totalCount / limit);

            return {
                activities,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            console.error('Error getting user activity history:', error);
            throw error;
        }
    }

    /**
     * Obtiene estadísticas de actividad del usuario
     * @param {string} userId - ID del usuario
     * @param {number} days - Número de días hacia atrás (por defecto 30)
     */
    static async getUserActivityStats(userId, days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const stats = await ActivityHistory.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: '$activityType',
                        count: { $sum: 1 },
                        lastActivity: { $max: '$createdAt' }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);

            const totalActivities = stats.reduce((total, stat) => total + stat.count, 0);

            return {
                totalActivities,
                activityBreakdown: stats,
                period: `${days} days`
            };
        } catch (error) {
            console.error('Error getting user activity stats:', error);
            throw error;
        }
    }

    /**
     * Elimina actividades antiguas del usuario
     * @param {string} userId - ID del usuario
     * @param {number} daysToKeep - Días a mantener
     */
    static async cleanupOldActivities(userId, daysToKeep = 365) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

            const result = await ActivityHistory.deleteMany({
                userId: new mongoose.Types.ObjectId(userId),
                createdAt: { $lt: cutoffDate }
            });

            return {
                deletedCount: result.deletedCount,
                cutoffDate
            };
        } catch (error) {
            console.error('Error cleaning up old activities:', error);
            throw error;
        }
    }
}

export default ActivityHistoryService;
