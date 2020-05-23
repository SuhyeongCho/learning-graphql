const { GraphQLScalarType } = require('graphql');

module.exports = {
  Photo: {
    url: (parent) => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: (parent) =>
      users.find((u) => u.githubLogin === parent.githubUser),
    taggedUsers: (parent) =>
      tags
        /** 현재 사진에 대한 태그만 배열에 담아 반환합니다. */
        .filter((tag) => tag.photoID === parent.id)
        /** 태그 배열을 userID 배열로 변환합니다. */
        .map((tag) => tag.userID)
        /** userID 배열을 사용자 객체 배열로 변환합니다. */
        .map((userID) => users.find((u) => u.githubLogin === userID))
  },

  User: {
    postedPhotos: (parent) =>
      photos.filter((p) => p.githubUser === parent.githubLogin),
    inPhotos: (parent) =>
      tags
        /** 현재 사용자에 대한 태그만 배열에 담아 반환합니다. */
        .filter((tag) => tag.userID === parent.id)
        /** 태그 배열을 photoID 배열로 변환합니다. */
        .map((tag) => tag.photoID)
        /** photoID 배열을 사진객체 배열로 변환합니다. */
        .map((photoID) => photos.find((p) => p.id === photoID))
  },

  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value',
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => ast.value
  })
};
