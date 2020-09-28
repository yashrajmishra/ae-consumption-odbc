import express from "express";
import morgan from "morgan";
import odbc from "odbc";

const app = express();

const config = {
  connnectionName: "AmitScadaDB",
  tableName: "Totalizer",
  port: 9876,
};

const dbConnection = odbc.connect(
  `DSN=${config.connnectionName}`,
  (error, connection) => {
    console.log(connection);
    console.error(error);

    if (!error) {
      app.use(
        morgan(":method :url :status :res[content-length] - :response-time ms")
      );
      app.use(express.json());

      app.get("/", (req, res) => {
        res.json({ message: "App Running" });
      });

      app.get("/getData", (req, res, next) => {
        //   const { start, end } = req.query;
        //   res.json({ message: `${start ? start : ""} ${end ? end : ""}` });
        dbConnection.query(`SELECT * FROM ${config.tableName}`, (error, result) => {
          if (error) {
            console.error(error);
            next();
          }
          console.log(result);
          res.json(result);
          next();
        });
        res.json({ message: `DB error` });
      });

      app.listen(config.port, () => {
        console.log(`Example app listening at http://localhost:${config.port}`);
      });
    }
  }
);
