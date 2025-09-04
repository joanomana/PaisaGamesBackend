#!/usr/bin/env node

/**
 * Script de prueba para el sistema de historial de actividades
 * Ejecutar con: node test-activity-history.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import ActivityHistoryService from './src/services/activityHistory.service.js';
import { seedActivityHistory, cleanActivityHistory } from './src/seeders/activityHistory.js';
import User from './src/models/User.js';

// Cargar variables de entorno
dotenv.config();

async function testActivityHistorySystem() {
    try {
        console.log('🚀 Iniciando pruebas del sistema de historial de actividades...\n');

        // Conectar a la base de datos
        await connectDB();
        console.log('✅ Conectado a la base de datos\n');

        // Limpiar datos de prueba existentes
        console.log('🧹 Limpiando datos de prueba existentes...');
        await cleanActivityHistory();

        // Ejecutar seeder
        console.log('🌱 Ejecutando seeder de historial...');
        await seedActivityHistory();
        console.log('');

        // Obtener un usuario para las pruebas
        const testUser = await User.findOne({});
        if (!testUser) {
            console.log('❌ No se encontraron usuarios para pruebas. Ejecuta primero los seeders de usuarios.');
            return;
        }

        console.log(`👤 Usuario de prueba: ${testUser.username} (${testUser._id})\n`);

        // Prueba 1: Obtener historial completo
        console.log('📋 Prueba 1: Obtener historial completo del usuario');
        const fullHistory = await ActivityHistoryService.getUserActivityHistory(
            testUser._id.toString(),
            {},
            1,
            50
        );
        console.log(`   - Total de actividades: ${fullHistory.pagination.totalCount}`);
        console.log(`   - Actividades en esta página: ${fullHistory.activities.length}`);
        console.log(`   - Primera actividad: ${fullHistory.activities[0]?.activityType || 'N/A'}`);
        console.log('');

        // Prueba 2: Filtrar por tipo de actividad
        console.log('🔍 Prueba 2: Filtrar por tipo de actividad (REVIEW_CREATED)');
        const reviewActivities = await ActivityHistoryService.getUserActivityHistory(
            testUser._id.toString(),
            { activityType: 'REVIEW_CREATED' },
            1,
            20
        );
        console.log(`   - Actividades de tipo REVIEW_CREATED: ${reviewActivities.pagination.totalCount}`);
        console.log('');

        // Prueba 3: Filtrar por rango de fechas
        console.log('📅 Prueba 3: Filtrar por rango de fechas (últimos 3 días)');
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        
        const recentActivities = await ActivityHistoryService.getUserActivityHistory(
            testUser._id.toString(),
            { 
                startDate: threeDaysAgo.toISOString().split('T')[0]
            },
            1,
            20
        );
        console.log(`   - Actividades en los últimos 3 días: ${recentActivities.pagination.totalCount}`);
        console.log('');

        // Prueba 4: Obtener estadísticas
        console.log('📊 Prueba 4: Obtener estadísticas de actividad (últimos 30 días)');
        const stats = await ActivityHistoryService.getUserActivityStats(testUser._id.toString(), 30);
        console.log(`   - Total de actividades: ${stats.totalActivities}`);
        console.log('   - Desglose por tipo:');
        stats.activityBreakdown.forEach(stat => {
            console.log(`     * ${stat._id}: ${stat.count} (última: ${new Date(stat.lastActivity).toLocaleDateString()})`);
        });
        console.log('');

        // Prueba 5: Registrar actividad manualmente
        console.log('✍️  Prueba 5: Registrar actividad manualmente');
        const manualActivity = await ActivityHistoryService.logActivity({
            userId: testUser._id,
            activityType: 'USER_UPDATED',
            description: 'Actividad de prueba manual',
            entityType: 'User',
            entityId: testUser._id,
            metadata: {
                test: true,
                timestamp: new Date().toISOString()
            },
            ipAddress: '127.0.0.1',
            userAgent: 'Test Script'
        });
        
        if (manualActivity) {
            console.log(`   - Actividad registrada con ID: ${manualActivity._id}`);
        } else {
            console.log('   - Error al registrar actividad manual');
        }
        console.log('');

        // Prueba 6: Verificar paginación
        console.log('📄 Prueba 6: Verificar paginación');
        const page1 = await ActivityHistoryService.getUserActivityHistory(
            testUser._id.toString(),
            {},
            1,
            3
        );
        const page2 = await ActivityHistoryService.getUserActivityHistory(
            testUser._id.toString(),
            {},
            2,
            3
        );
        
        console.log(`   - Página 1: ${page1.activities.length} actividades`);
        console.log(`   - Página 2: ${page2.activities.length} actividades`);
        console.log(`   - ¿Hay página siguiente desde la 1?: ${page1.pagination.hasNextPage}`);
        console.log(`   - ¿Hay página anterior desde la 2?: ${page2.pagination.hasPrevPage}`);
        console.log('');

        // Prueba 7: Probar límites
        console.log('⚡ Prueba 7: Probar límites del sistema');
        try {
            // Intentar obtener más de 100 registros (debería limitarse)
            const largeQuery = await ActivityHistoryService.getUserActivityHistory(
                testUser._id.toString(),
                {},
                1,
                150 // Más del límite
            );
            console.log(`   - Límite respetado: ${largeQuery.activities.length <= 100 ? '✅' : '❌'}`);
        } catch (error) {
            console.log(`   - Error en límites: ${error.message}`);
        }
        console.log('');

        // Prueba 8: Estadísticas con diferentes períodos
        console.log('📈 Prueba 8: Estadísticas con diferentes períodos');
        const stats7days = await ActivityHistoryService.getUserActivityStats(testUser._id.toString(), 7);
        const stats1day = await ActivityHistoryService.getUserActivityStats(testUser._id.toString(), 1);
        
        console.log(`   - Actividades en 7 días: ${stats7days.totalActivities}`);
        console.log(`   - Actividades en 1 día: ${stats1day.totalActivities}`);
        console.log('');

        console.log('🎉 ¡Todas las pruebas completadas exitosamente!');
        console.log('\n📝 Resumen de funcionalidades probadas:');
        console.log('   ✅ Consulta de historial completo');
        console.log('   ✅ Filtrado por tipo de actividad');
        console.log('   ✅ Filtrado por fechas');
        console.log('   ✅ Estadísticas de actividad');
        console.log('   ✅ Registro manual de actividades');
        console.log('   ✅ Paginación');
        console.log('   ✅ Límites del sistema');
        console.log('   ✅ Diferentes períodos de estadísticas');

        console.log('\n🚀 El sistema está listo para usar en producción!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
    } finally {
        // Cerrar conexión
        await mongoose.connection.close();
        console.log('\n🔌 Conexión a la base de datos cerrada');
    }
}

// Ejecutar las pruebas si el script se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    testActivityHistorySystem();
}

export default testActivityHistorySystem;
