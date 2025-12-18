import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'clau_events';

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}

// Definir tipo para la conexión en caché
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Extender el tipo global para TypeScript
declare global {
    var mongoose: MongooseCache | undefined;
}

// Inicializar o usar la caché existente
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
    // Si ya hay conexión, retornarla
    if (cached.conn) {
        return cached.conn;
    }

    // Si no hay una promesa de conexión pendiente, crear una
    if (!cached.promise) {
        const opts: ConnectOptions = {
            bufferCommands: false, // Deshabilita el buffering de comandos
            dbName: MONGODB_DB,
            maxIdleTimeMS: 10000, // Cierra conexiones después de 10s de inactividad
            serverSelectionTimeoutMS: 5000, // Timeout para selección de servidor
            socketTimeoutMS: 45000, // Timeout para operaciones
        };

        // Convertimos a string porque ya verificamos que no es undefined
        cached.promise = mongoose.connect(MONGODB_URI as string, opts)
            .then((mongooseInstance) => {
                console.log('✅ MongoDB connected successfully');
                return mongooseInstance;
            })
            .catch((error) => {
                console.error('❌ MongoDB connection error:', error);
                // Limpiar la promesa para permitir reintentos
                cached.promise = null;
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // Si hay error, limpiar la promesa
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

// Opcional: Función para verificar el estado de la conexión
export async function checkConnection(): Promise<boolean> {
    try {
        await connectDB();
        return mongoose.connection.readyState === 1;
    } catch {
        return false;
    }
}