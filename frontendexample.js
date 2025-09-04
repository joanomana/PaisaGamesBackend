/**
 * Ejemplo de implementación del frontend para el sistema de historial de actividades
 * Este archivo muestra cómo consumir los endpoints desde una aplicación React/JavaScript
 */

// ===== SERVICIOS API =====

class ActivityHistoryAPI {
    constructor(baseURL = '/api/v1', token = null) {
        this.baseURL = baseURL;
        this.token = token;
    }

    setToken(token) {
        this.token = token;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Obtener historial con filtros
    async getActivityHistory(filters = {}) {
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value);
            }
        });

        const queryString = params.toString();
        const endpoint = `/activity-history${queryString ? `?${queryString}` : ''}`;
        
        return this.request(endpoint);
    }

    // Obtener actividades recientes
    async getRecentActivities() {
        return this.request('/activity-history/recent');
    }

    // Obtener estadísticas
    async getActivityStats(days = 30) {
        return this.request(`/activity-history/stats?days=${days}`);
    }

    // Obtener tipos de actividades
    async getActivityTypes() {
        return this.request('/activity-history/types');
    }

    // Limpiar actividades antiguas
    async cleanupActivities(daysToKeep = 365) {
        return this.request('/activity-history/cleanup', {
            method: 'DELETE',
            body: JSON.stringify({ daysToKeep })
        });
    }
}

// ===== COMPONENTES REACT =====

// Hook personalizado para manejar el historial de actividades
function useActivityHistory() {
    const [activities, setActivities] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [pagination, setPagination] = React.useState(null);
    const [filters, setFilters] = React.useState({});

    const api = new ActivityHistoryAPI('/api/v1', localStorage.getItem('token'));

    const loadActivities = async (newFilters = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await api.getActivityHistory({ ...filters, ...newFilters });
            setActivities(response.data);
            setPagination(response.pagination);
            setFilters({ ...filters, ...newFilters });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (pagination?.hasNextPage) {
            await loadActivities({ page: pagination.currentPage + 1 });
        }
    };

    const applyFilters = async (newFilters) => {
        await loadActivities({ ...newFilters, page: 1 });
    };

    React.useEffect(() => {
        loadActivities();
    }, []);

    return {
        activities,
        loading,
        error,
        pagination,
        filters,
        loadActivities,
        loadMore,
        applyFilters
    };
}

// Componente de filtros
function ActivityFilters({ onFiltersChange, activityTypes = [] }) {
    const [localFilters, setLocalFilters] = React.useState({
        activityType: '',
        startDate: '',
        endDate: '',
        entityType: ''
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            activityType: '',
            startDate: '',
            endDate: '',
            entityType: ''
        };
        setLocalFilters(emptyFilters);
        onFiltersChange(emptyFilters);
    };

    return (
        <div className="activity-filters">
            <h3>Filtros</h3>
            
            <div className="filter-row">
                <label>
                    Tipo de actividad:
                    <select 
                        value={localFilters.activityType} 
                        onChange={(e) => handleFilterChange('activityType', e.target.value)}
                    >
                        <option value="">Todos los tipos</option>
                        {activityTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="filter-row">
                <label>
                    Fecha inicio:
                    <input 
                        type="date" 
                        value={localFilters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                </label>
                
                <label>
                    Fecha fin:
                    <input 
                        type="date" 
                        value={localFilters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                </label>
            </div>

            <div className="filter-row">
                <label>
                    Tipo de entidad:
                    <select 
                        value={localFilters.entityType} 
                        onChange={(e) => handleFilterChange('entityType', e.target.value)}
                    >
                        <option value="">Todas las entidades</option>
                        <option value="Review">Reseñas</option>
                        <option value="User">Usuario</option>
                        <option value="ReviewReaction">Reacciones</option>
                    </select>
                </label>
            </div>

            <button onClick={clearFilters} className="clear-filters-btn">
                Limpiar filtros
            </button>
        </div>
    );
}

// Componente para mostrar una actividad individual
function ActivityItem({ activity }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActivityIcon = (type) => {
        const icons = {
            'REVIEW_CREATED': '📝',
            'REVIEW_UPDATED': '✏️',
            'REVIEW_DELETED': '🗑️',
            'USER_REGISTERED': '👋',
            'USER_UPDATED': '👤',
            'REACTION_ADDED': '👍',
            'REACTION_REMOVED': '👎'
        };
        return icons[type] || '📋';
    };

    return (
        <div className="activity-item">
            <div className="activity-icon">
                {getActivityIcon(activity.activityType)}
            </div>
            
            <div className="activity-content">
                <div className="activity-description">
                    {activity.description}
                </div>
                
                <div className="activity-meta">
                    <span className="activity-date">
                        {formatDate(activity.createdAt)}
                    </span>
                    
                    <span className="activity-type">
                        {activity.activityType}
                    </span>
                    
                    {activity.metadata?.rating && (
                        <span className="activity-rating">
                            ⭐ {activity.metadata.rating}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// Componente principal del historial
function ActivityHistory() {
    const {
        activities,
        loading,
        error,
        pagination,
        applyFilters,
        loadMore
    } = useActivityHistory();
    
    const [activityTypes, setActivityTypes] = React.useState([]);
    const [stats, setStats] = React.useState(null);

    const api = new ActivityHistoryAPI('/api/v1', localStorage.getItem('token'));

    React.useEffect(() => {
        // Cargar tipos de actividades para los filtros
        api.getActivityTypes().then(response => {
            setActivityTypes(response.data);
        }).catch(console.error);

        // Cargar estadísticas
        api.getActivityStats(30).then(response => {
            setStats(response.data);
        }).catch(console.error);
    }, []);

    if (error) {
        return (
            <div className="error-message">
                <h3>Error al cargar el historial</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Recargar página
                </button>
            </div>
        );
    }

    return (
        <div className="activity-history">
            <header className="activity-header">
                <h2>Mi Historial de Actividades</h2>
                
                {stats && (
                    <div className="activity-stats">
                        <div className="stat-item">
                            <strong>{stats.totalActivities}</strong>
                            <span>Actividades en 30 días</span>
                        </div>
                        
                        <div className="stat-breakdown">
                            {stats.activityBreakdown.slice(0, 3).map(item => (
                                <div key={item._id} className="stat-mini">
                                    <span className="stat-type">{item._id}</span>
                                    <span className="stat-count">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            <div className="activity-content">
                <aside className="activity-sidebar">
                    <ActivityFilters 
                        onFiltersChange={applyFilters}
                        activityTypes={activityTypes}
                    />
                </aside>

                <main className="activity-main">
                    {loading && activities.length === 0 ? (
                        <div className="loading">Cargando actividades...</div>
                    ) : (
                        <>
                            <div className="activity-list">
                                {activities.length === 0 ? (
                                    <div className="empty-state">
                                        <h3>No hay actividades</h3>
                                        <p>No se encontraron actividades con los filtros actuales.</p>
                                    </div>
                                ) : (
                                    activities.map(activity => (
                                        <ActivityItem key={activity._id} activity={activity} />
                                    ))
                                )}
                            </div>

                            {pagination?.hasNextPage && (
                                <div className="load-more">
                                    <button 
                                        onClick={loadMore} 
                                        disabled={loading}
                                        className="load-more-btn"
                                    >
                                        {loading ? 'Cargando...' : 'Cargar más'}
                                    </button>
                                </div>
                            )}

                            {pagination && (
                                <div className="pagination-info">
                                    Página {pagination.currentPage} de {pagination.totalPages} 
                                    ({pagination.totalCount} total)
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

// ===== ESTILOS CSS =====

const styles = `
.activity-history {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.activity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.activity-stats {
    display: flex;
    gap: 20px;
    align-items: center;
}

.stat-item {
    text-align: center;
}

.stat-item strong {
    display: block;
    font-size: 24px;
    color: #2563eb;
}

.stat-breakdown {
    display: flex;
    gap: 10px;
}

.stat-mini {
    background: #f3f4f6;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
}

.activity-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 30px;
}

.activity-filters {
    background: #f9fafb;
    padding: 20px;
    border-radius: 8px;
    height: fit-content;
}

.filter-row {
    margin-bottom: 15px;
}

.filter-row label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.filter-row input,
.filter-row select {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
}

.clear-filters-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
}

.activity-item {
    display: flex;
    gap: 15px;
    padding: 15px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 10px;
    background: white;
}

.activity-icon {
    font-size: 20px;
    width: 40px;
    text-align: center;
}

.activity-content {
    flex: 1;
}

.activity-description {
    font-weight: 500;
    margin-bottom: 5px;
}

.activity-meta {
    display: flex;
    gap: 15px;
    font-size: 12px;
    color: #6b7280;
}

.load-more-btn {
    background: #2563eb;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    margin: 20px 0;
}

.pagination-info {
    text-align: center;
    color: #6b7280;
    font-size: 14px;
    margin-top: 20px;
}

.loading,
.empty-state {
    text-align: center;
    padding: 40px;
    color: #6b7280;
}

.error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}

@media (max-width: 768px) {
    .activity-content {
        grid-template-columns: 1fr;
    }
    
    .activity-header {
        flex-direction: column;
        gap: 15px;
    }
}
`;

// Inyectar estilos si estamos en el navegador
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Exportar para uso en otros archivos
export {
    ActivityHistoryAPI,
    useActivityHistory,
    ActivityFilters,
    ActivityItem,
    ActivityHistory
};
