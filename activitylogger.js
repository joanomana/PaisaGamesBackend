import ActivityHistoryService from '../services/activityHistory.service.js';

/**
 * Middleware para registrar actividades automáticamente
 * Se debe usar después de que la operación principal haya sido exitosa
 */
const activityLogger = (activityType, description, entityType, options = {}) => {
    return async (req, res, next) => {
        // Guardamos la función original de res.json
        const originalJson = res.json.bind(res);
        
        // Sobrescribimos res.json para interceptar respuestas exitosas
        res.json = function(data) {
            // Solo registrar si la respuesta es exitosa (status < 400)
            // Para registro, usar userId de la respuesta; para otras operaciones usar req.user._id
            const userId = options.useUserIdFromResponse 
                ? (data.data?.user?.id || data.data?.user?._id || data.user?.id || data.user?._id)
                : req.user?._id;
                
            if (res.statusCode < 400 && userId) {
                // Extraer entityId según el contexto
                let entityId = null;
                
                if (options.entityIdFromBody) {
                    entityId = req.body[options.entityIdFromBody];
                } else if (options.entityIdFromParams) {
                    entityId = req.params[options.entityIdFromParams];
                } else if (options.entityIdFromResponse) {
                    // Navegar a través de propiedades anidadas
                    const path = options.entityIdFromResponse.split('.');
                    entityId = path.reduce((obj, key) => obj && obj[key], data);
                } else if (data._id) {
                    entityId = data._id;
                } else if (data.data?._id) {
                    entityId = data.data._id;
                }

                // Preparar metadata
                const metadata = {
                    endpoint: req.originalUrl,
                    method: req.method,
                    ...options.metadata
                };

                // Si hay datos específicos que queremos guardar
                if (options.includeBodyFields) {
                    options.includeBodyFields.forEach(field => {
                        if (req.body[field] !== undefined) {
                            metadata[field] = req.body[field];
                        }
                    });
                }

                // Registrar la actividad de forma asíncrona
                setImmediate(async () => {
                    try {
                        await ActivityHistoryService.logActivity({
                            userId,
                            activityType,
                            description: typeof description === 'function' 
                                ? description(req, res, data) 
                                : description,
                            entityType,
                            entityId,
                            metadata,
                            ipAddress: req.ip || req.connection.remoteAddress,
                            userAgent: req.get('User-Agent')
                        });
                    } catch (error) {
                        console.error('Error logging activity:', error);
                    }
                });
            }
            
            // Llamar a la función original
            return originalJson(data);
        };
        
        next();
    };
};

/**
 * Funciones helper para generar descripciones dinámicas
 */
export const activityDescriptions = {
    reviewCreated: (req, res, data) => {
        const mediaTitle = req.body.mediaTitle || 'una película/serie';
        return `Creó una reseña para "${mediaTitle}"`;
    },
    
    reviewUpdated: (req, res, data) => {
        return `Actualizó una reseña`;
    },
    
    reviewDeleted: (req, res, data) => {
        return `Eliminó una reseña`;
    },
    
    userRegistered: (req, res, data) => {
        return `Se registró en la plataforma`;
    },
    
    userUpdated: (req, res, data) => {
        return `Actualizó su perfil`;
    },
    
    reactionAdded: (req, res, data) => {
        const reaction = req.body.reaction || 'una reacción';
        return `Agregó ${reaction} a una reseña`;
    },
    
    reactionRemoved: (req, res, data) => {
        return `Eliminó su reacción de una reseña`;
    }
};

/**
 * Middleware específicos para diferentes tipos de actividades
 */
export const logReviewCreated = activityLogger(
    'REVIEW_CREATED',
    activityDescriptions.reviewCreated,
    'Review',
    {
        entityIdFromResponse: '_id',
        includeBodyFields: ['rating', 'title'],
        metadata: { action: 'create' }
    }
);

export const logReviewUpdated = activityLogger(
    'REVIEW_UPDATED',
    activityDescriptions.reviewUpdated,
    'Review',
    {
        entityIdFromParams: 'id',
        includeBodyFields: ['rating', 'title'],
        metadata: { action: 'update' }
    }
);

export const logReviewDeleted = activityLogger(
    'REVIEW_DELETED',
    activityDescriptions.reviewDeleted,
    'Review',
    {
        entityIdFromParams: 'id',
        metadata: { action: 'delete' }
    }
);

export const logUserRegistered = activityLogger(
    'USER_REGISTERED',
    activityDescriptions.userRegistered,
    'User',
    {
        entityIdFromResponse: 'data.user.id',
        includeBodyFields: ['username', 'email'],
        metadata: { action: 'register' },
        useUserIdFromResponse: true // Usar el ID del usuario de la respuesta en lugar de req.user
    }
);

export const logUserUpdated = activityLogger(
    'USER_UPDATED',
    activityDescriptions.userUpdated,
    'User',
    {
        entityIdFromParams: 'id',
        metadata: { action: 'update' }
    }
);

export const logReactionAdded = activityLogger(
    'REACTION_ADDED',
    activityDescriptions.reactionAdded,
    'ReviewReaction',
    {
        entityIdFromResponse: '_id',
        includeBodyFields: ['reaction'],
        metadata: { action: 'add_reaction' }
    }
);

export const logReactionRemoved = activityLogger(
    'REACTION_REMOVED',
    activityDescriptions.reactionRemoved,
    'ReviewReaction',
    {
        entityIdFromParams: 'reactionId',
        metadata: { action: 'remove_reaction' }
    }
);

export default activityLogger;
