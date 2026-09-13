module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String,
      headerColor: String,
      items: Array,
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Card = mongoose.model("card", schema);
  return Card;
};
