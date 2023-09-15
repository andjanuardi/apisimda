import { query as msquery } from "msnodesqlv8";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const post = JSON.parse(req.body);
    try {
      const connectionString = `DSN=${process.env.DSN};UID=${process.env.DBUSER};DATABASE=${post.db};PWD=${process.env.DBPASS}`;
      const q = `SELECT
        ta_kontrak.tahun,
        ta_kontrak.kd_urusan,
        ta_kontrak.kd_bidang,
        ta_kontrak.kd_unit,
        ta_kontrak.kd_sub,
        ta_kontrak.no_kontrak,
        ta_kontrak.tgl_kontrak,
        ta_kontrak.nilai,
        ta_kontrak.keperluan,
        ta_kontrak.waktu,
        ta_kontrak.nm_perusahaan,
        ta_kontrak.alamat,
        ta_kontrak.nm_pemilik,
        ta_sp2d.no_sp2d,
        ta_sp2d.tgl_sp2d,
        ta_tagihan.nilai - ta_tagihan.nilai_um  AS nilai_sp2d,
        ta_sp2d.keterangan
        FROM (((ta_kontrak LEFT JOIN ta_tagihan ON ta_kontrak.no_kontrak = ta_tagihan.no_kontrak) LEFT JOIN ta_spp ON ta_tagihan.no_tagihan = ta_spp.no_tagihan) LEFT JOIN ta_spm ON ta_spp.no_spp = ta_spm.no_spp) LEFT JOIN ta_sp2d ON ta_spm.no_spm = ta_sp2d.no_spm
        WHERE ta_kontrak.no_kontrak='${post.no_kontrak}' AND ta_sp2d.no_sp2d IS NOT NULL
        ORDER BY tgl_sp2d
        ;
        `;

      // ta_kontrak.tahun=${post.tahun} AND
      // ta_kontrak.kd_urusan=${post.kd_urusan} AND
      // ta_kontrak.kd_bidang=${post.kd_bidang} AND
      // ta_kontrak.kd_unit=${post.kd_unit} AND
      // ta_kontrak.kd_sub=${post.kd_sub} AND
      //   const q = `SELECT top 10 * FROM ta_sp2d; `;
      console.log("🚀 ~ file: sp2d.js:14 ~ handler ~ q:", q);

      const data = await new Promise((resolve, reject) => {
        msquery(connectionString, q, (err, rows) => {
          if (!err) {
            resolve(rows);
          } else {
            reject(err);
          }
        });
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(200).json(error);
    }
  }
}
