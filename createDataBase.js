import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://duqr1308:tuta1234@cluster0.9kwddu2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function createDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("miBaseDeDatos"); // Cambia esto por el nombre de tu base de datos
    const collection = db.collection("miColeccion"); // Cambia esto por el nombre de tu colección

    const result = await collection.insertOne({ mensaje: "Hola, MongoDB!" });
    console.log("Documento insertado:", result);

  } catch (err) {
    console.error('Failed to create database and collection', err);
  } finally {
    await client.close();
  }
}

createDatabase().catch(console.dir);
