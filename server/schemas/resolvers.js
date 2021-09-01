const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {return await User.findOne({ _id: context.user._id });}
      throw new AuthenticationError('You must be logged in.');
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      try {const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
      }catch (error) {
        console.log(error)
      }
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if(!user) {
        throw new AuthenticationError('Wrong login!');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {throw new AuthenticationError('Incorrect login information!');}
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input }, context) => {
      if (context.user){
        const userSaved = await User.findByIdAndUpdate(
          { _id: context.user._id},
          { $addToSet: {savedBooks: input} },
          { new: true }
        );
        return userSaved;
      }
      throw new AuthenticationError('log in!');
    },
    removeBook: async (parent, { input }, context) => {
      if (context.user){
        const userRemove = await User.findOneAndUpdate(
          { _id: context.user._id},
          { $pull: {savedBooks: input} },
          { new: true }  
        );
        return userRemove  
      }
      throw new AuthenticationError('log in!');
    }
  },
};

module.exports = resolvers;