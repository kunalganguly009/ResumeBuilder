const mongoose = require("mongoose");
mongoose
  .connect(`mongodb+srv://VisualResume:VisualResume@cluster0.jovrj.mongodb.net/?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`connected to ${process.env.DB_Name} DB`);
  })
  .catch((e) => {
    console.log(e);
  });
