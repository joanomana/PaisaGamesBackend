import mongoose from 'mongoose';

export const ACTIVITY_TYPES = [
    'REVIEW_CREATED',
    'REVIEW_UPDATED', 
    'REVIEW_DELETED',
    'USER_REGISTERED',
    'USER_UPDATED',
    'REACTION_ADDED',
    'REACTION_REMOVED'
];

const activityHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    activityType: {
        type: String,
        enum: ACTIVITY_TYPES,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    entityType: {
        type: String,
        enum: ['Review', 'User', 'Media', 'ReviewReaction'],
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'activity_history'
});

// Índices compuestos para mejorar rendimiento en consultas
activityHistorySchema.index({ userId: 1, createdAt: -1 });
activityHistorySchema.index({ userId: 1, activityType: 1, createdAt: -1 });
activityHistorySchema.index({ createdAt: -1 });

// TTL index para eliminar registros antiguos automáticamente (opcional)
// Elimina registros después de 365 días
activityHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

const ActivityHistory = mongoose.model('ActivityHistory', activityHistorySchema);

export default ActivityHistory;
