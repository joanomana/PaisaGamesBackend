import ActivityHistoryService from '../services/activityHistory.service.js';
import { ACTIVITY_TYPES } from '../models/ActivityHistory.js';
import { validationResult } from 'express-validator';

/**
 * Obtiene el historial de actividades del usuario autenticado
 * GET /api/v1/activity-history
 */
export const getUserActivityHistory = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }

        const userId = req.user._id;
        const {
            page = 1,
            limit = 20,
            activityType,
            startDate,
            endDate,
            entityType
        } = req.query;

        // Validar parámetros
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Máximo 100 por página

        // Construir filtros
        const filters = {};
        
        if (activityType) {
            filters.activityType = activityType;
        }
        
        if (startDate) {
            filters.startDate = startDate;
        }
        
        if (endDate) {
            filters.endDate = endDate;
        }
        
        if (entityType) {
            filters.entityType = entityType;
        }

        const result = await ActivityHistoryService.getUserActivityHistory(
            userId,
            filters,
            pageNum,
            limitNum
        );

        res.json({
            success: true,
            message: 'Historial de actividades obtenido exitosamente',
            data: result.activities,
            pagination: result.pagination,
            filters: {
                activityType: activityType || null,
                startDate: startDate || null,
                endDate: endDate || null,
                entityType: entityType || null
            }
        });

    } catch (error) {
        console.error('Error getting user activity history:', error);
        next(error);
    }
};

/**
 * Obtiene estadísticas de actividad del usuario
 * GET /api/v1/activity-history/stats
 */
export const getUserActivityStats = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { days = 30 } = req.query;
        
        const daysNum = Math.min(365, Math.max(1, parseInt(days))); // Entre 1 y 365 días

        const stats = await ActivityHistoryService.getUserActivityStats(userId, daysNum);

        res.json({
            success: true,
            message: 'Estadísticas de actividad obtenidas exitosamente',
            data: stats
        });

    } catch (error) {
        console.error('Error getting user activity stats:', error);
        next(error);
    }
};

/**
 * Obtiene los tipos de actividades disponibles
 * GET /api/v1/activity-history/types
 */
export const getActivityTypes = async (req, res, next) => {
    try {
        const activityTypes = ACTIVITY_TYPES.map(type => ({
            value: type,
            label: formatActivityTypeLabel(type)
        }));

        res.json({
            success: true,
            message: 'Tipos de actividad obtenidos exitosamente',
            data: activityTypes
        });

    } catch (error) {
        console.error('Error getting activity types:', error);
        next(error);
    }
};

/**
 * Elimina actividades antiguas del usuario
 * DELETE /api/v1/activity-history/cleanup
 */
export const cleanupUserActivities = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }

        const userId = req.user._id;
        const { daysToKeep = 365 } = req.body;
        
        const daysNum = Math.min(365, Math.max(30, parseInt(daysToKeep))); // Entre 30 y 365 días

        const result = await ActivityHistoryService.cleanupOldActivities(userId, daysNum);

        res.json({
            success: true,
            message: 'Limpieza de actividades completada exitosamente',
            data: {
                deletedCount: result.deletedCount,
                cutoffDate: result.cutoffDate,
                daysKept: daysNum
            }
        });

    } catch (error) {
        console.error('Error cleaning up user activities:', error);
        next(error);
    }
};

/**
 * Obtiene actividades recientes del usuario (últimas 10)
 * GET /api/v1/activity-history/recent
 */
export const getRecentActivities = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const result = await ActivityHistoryService.getUserActivityHistory(
            userId,
            {},
            1,
            10
        );

        res.json({
            success: true,
            message: 'Actividades recientes obtenidas exitosamente',
            data: result.activities
        });

    } catch (error) {
        console.error('Error getting recent activities:', error);
        next(error);
    }
};

/**
 * Función helper para formatear etiquetas de tipos de actividad
 */
function formatActivityTypeLabel(type) {
    const labels = {
        'REVIEW_CREATED': 'Reseña creada',
        'REVIEW_UPDATED': 'Reseña actualizada',
        'REVIEW_DELETED': 'Reseña eliminada',
        'USER_REGISTERED': 'Usuario registrado',
        'USER_UPDATED': 'Perfil actualizado',
        'REACTION_ADDED': 'Reacción agregada',
        'REACTION_REMOVED': 'Reacción eliminada'
    };
    
    return labels[type] || type;
}

export default {
    getUserActivityHistory,
    getUserActivityStats,
    getActivityTypes,
    cleanupUserActivities,
    getRecentActivities
};
