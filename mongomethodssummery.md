Common Mongoose Methods
This document summarizes the most commonly used Mongoose methods for interacting with MongoDB in Node.js applications.
1. Schema and Model Creation

mongoose.Schema: Defines the structure of documents in a collection.
Example: Create a user schema with name, email, and age fields.


mongoose.model: Compiles a schema into a model for CRUD operations.
Example: const User = mongoose.model('User', userSchema);



2. CRUD Operations
Create

Model.create: Inserts one or more documents.
Example: await User.create({ name: 'Alice', email: 'alice@example.com' });


new Model().save(): Creates and saves a document instance.
Example: const user = new User({ name: 'Bob' }); await user.save();



Read

Model.find: Retrieves all documents matching a query.
Example: await User.find({ age: { $gte: 18 } });


Model.findOne: Retrieves the first matching document.
Example: await User.findOne({ email: 'alice@example.com' });


Model.findById: Retrieves a document by its _id.
Example: await User.findById('507f1f77bcf86cd799439011');



Update

Model.updateOne: Updates the first matching document.
Example: await User.updateOne({ email: 'alice@example.com' }, { age: 26 });


Model.findOneAndUpdate: Updates and returns a document.
Example: await User.findOneAndUpdate({ email: 'alice@example.com' }, { age: 27 }, { new: true });


Model.findByIdAndUpdate: Updates a document by _id.
Example: await User.findByIdAndUpdate('507f1f77bcf86cd799439011', { age: 28 }, { new: true });



Delete

Model.deleteOne: Deletes the first matching document.
Example: await User.deleteOne({ email: 'alice@example.com' });


Model.findByIdAndDelete: Deletes a document by _id and returns it.
Example: await User.findByIdAndDelete('507f1f77bcf86cd799439011');



3. Query Building

Query.select: Specifies fields to include/exclude.
Example: await User.find({}).select('name email');


Query.sort: Sorts results by a field.
Example: await User.find({}).sort({ age: -1 });


Query.limit: Limits the number of documents.
Example: await User.find({}).limit(10);


Query.populate: Populates referenced documents.
Example: await User.findById(userId).populate('posts');



4. Aggregation

Model.aggregate: Performs complex data processing.
Example: await User.aggregate([{ $match: { age: { $gte: 18 } } }, { $group: { _id: null, averageAge: { $avg: '$age' } } }]);



5. Middleware

schema.pre: Runs before an operation (e.g., save).
Example: Convert email to lowercase before saving.


schema.post: Runs after an operation.
Example: Log after a document is saved.



6. Example: Managing Favorites
To toggle an item in a user’s favourites array:
async function toggleFavorite(userId, homeId) {
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav !== homeId);
  } else {
    user.favourites.push(homeId);
  }
  await user.save();
}
