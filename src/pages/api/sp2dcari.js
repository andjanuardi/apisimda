import { query as msquery } from "msnodesqlv8";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const post = JSON.parse(req.body);
    try {
      const connectionString = `DSN=${process.env.DSN};UID=${process.env.DBUSER};DATABASE=${post.db};PWD=${process.env.DBPASS}`;
      const q = `SELECT TOP 10 
      ta_sp2d.tahun, 
      ta_spm.kd_urusan, 
      ta_spm.kd_bidang,
      ta_spm.kd_unit,
      ta_spm.kd_sub,
      ta_sp2d.no_sp2d,
      ta_sp2d.tgl_sp2d,
      ta_sp2d.no_spm,
      ta_spm.tgl_spm,
      ta_spm.no_spp,
      ta_spp.tgl_spp,
      ta_spp.no_tagihan,
      ta_tagihan.no_kontrak,
      ta_tagihan.tgl_tagihan,
      ta_tagihan.nilai - ta_tagihan.nilai_um as nilai_sp2d,
      ta_spp.nm_penerima,
      ta_spp.alamat_penerima,
      ta_sp2d.keterangan
      FROM ta_tagihan LEFT JOIN (ta_spp LEFT JOIN (ta_sp2d RIGHT JOIN ta_spm ON ta_sp2d.no_spm = ta_spm.no_spm) ON ta_spp.no_spp = ta_spm.no_spp) ON ta_tagihan.no_tagihan = ta_spp.no_tagihan 
      WHERE ta_sp2d.tahun=${post.tahun} AND
       ta_spm.kd_urusan=${post.kd_urusan} AND
       ta_spm.kd_bidang=${post.kd_bidang} AND
       ta_spm.kd_unit=${post.kd_unit} AND
       ta_spm.kd_sub=${post.kd_sub} AND
       (LOWER(ta_sp2d.no_sp2d) LIKE LOWER('%${post.q}%') OR LOWER(ta_sp2d.keterangan) LIKE LOWER('%${post.q}%') )
    
      ORDER BY ta_sp2d.tgl_sp2d
      `;
      console.log("🚀 ~ file: sp2dcari.js:13 ~ handler ~ q:", q);

      const data = await new Promise((resolve, reject) => {
        msquery(connectionString, q, (err, rows) => {
          if (!err) {
            resolve(rows);
          } else {
            reject(false);
          }
        });
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(200).json(error);
    }
  }
}
