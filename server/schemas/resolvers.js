const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      throw new AuthenticationError("User is not logged in");
    },
  },

  Mutation: {
    //add user mutation
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    // log in mutation
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    // saveBook mutation
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const savedBook = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );

        return savedBook;
      }

      throw new AuthenticationError(
        "You need to be logged in to save a new book."
      );
    },
    // removeBook mutation
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const removeBook = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } }
        );

        return removeBook;
      }

      throw new AuthenticationError(
        "You need to be logged in to remove a book."
      );
    },
  },
};

module.exports = resolvers;
