module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      titre: String,
      date: String,
      utilisateur: String,
      type: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Historic = mongoose.model("historic", schema);
  return Historic;
};
