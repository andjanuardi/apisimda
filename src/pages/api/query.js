import { query as msquery } from "msnodesqlv8";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const post = JSON.parse(req.body);
    try {
      const connectionString = `DSN=${process.env.DSN};UID=${process.env.DBUSER};DATABASE=${post.db};PWD=${process.env.DBPASS}`;
      const query = post.q;
      console.log("🚀 ~ file: query.js:9 ~ handler ~ query:", query);
      msquery(connectionString, query, (err, rows) => {
        if (!err) {
          res.status(200).json(rows);
        } else {
          res.status(200).json(err);
        }
      });
    } catch (error) {
      res.status(200).json(false);
    }
  }
}
