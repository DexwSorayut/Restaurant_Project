import { SQLiteProvider } from 'expo-sqlite';
import { DATABASE_NAME, initDB } from './src/db/database';
import MainScreen from './src/screen/MainScreen';

export default function App() {
    return (
        <SQLiteProvider
            databaseName={DATABASE_NAME}
            onInit={initDB}
        >
            <MainScreen />
        </SQLiteProvider>
    );
}