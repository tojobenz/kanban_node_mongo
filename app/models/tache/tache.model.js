module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      titre: String,
      date: String,
      description: String,
      actif: Boolean,
      utilisateur: String,
      card: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Tache = mongoose.model("tache", schema);
  return Tache;
};
