import { query as msquery } from "msnodesqlv8";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const post = JSON.parse(req.body);
    try {
      const connectionString = `DSN=${process.env.DSN};UID=${process.env.DBUSER};DATABASE=${post.db};PWD=${process.env.DBPASS}`;
      const query = `SELECT * FROM ta_kontrak 
        WHERE tahun=${post.tahun} and 
        kd_urusan=${post.kd_urusan} and 
        kd_bidang=${post.kd_bidang} and 
        kd_unit=${post.kd_unit} and 
        kd_sub=${post.kd_sub}`;

      console.log("🚀 ~ file: kontrak.js:10 ~ handler ~ query:", query);
      msquery(connectionString, query, (err, rows) => {
        if (!err) {
          res.status(200).json(rows);
        } else {
          res.status(200).json(false);
        }
      });
    } catch (error) {
      res.status(200).json(false);
    }
  }
}
