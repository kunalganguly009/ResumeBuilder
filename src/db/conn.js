const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://projectResumeBuilder:resumeBuilderPassword@cluster0.vvtztm1.mongodb.net/resumeBuilderDB?retryWrites=true&w=majority&appName=Cluster0`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(() => {
  console.log(`connected to ${process.env.DB_Name} DB`);
  })
  .catch((e) => {
    console.log(e);
  });
