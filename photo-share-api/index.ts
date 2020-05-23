/** 'apollo-server'를 불러옵니다. */
const { ApolloServer } = require('apollo-server');

const typeDefs = `

  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }
  
  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
  }

  # Photo 타입 정의를 추가합니다.
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
  }

  # allPhoto에서 Photo 타입을 반환합니다.
  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  # 뮤테이션에서 새로 게시된 사진을 반환합니다.
  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`;

/** 고유 ID를 만들기 위해 값을 하나씩 증가시킬 변수입니다. */
let _id = 0;

const users = [
  { githubLogin: 'mHattrup', name: 'Mike Hattrup' },
  { githubLogin: 'gPlake', name: 'Glen Plake' },
  { githubLogin: 'sSchmidt', name: 'Scot Schmidt' }
];

/** 메모리에 사진을 저장할 떄 사용할 데이터 타입 */
const photos = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'gPlake'
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt'
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt'
  }
];

const resolvers = {
  Query: {
    /** 사진 배열의 길이를 반환합니다. */
    totalPhotos: () => photos.length,
    allPhotos: () => photos
  },

  /** Mutation & postPhoto 리졸버 함수 */
  Mutation: {
    postPhoto(parent, args) {
      /** 새로운 사진을 만들고 id를 부여합니다. */
      const newPhoto = {
        id: _id++,
        ...args.input
      };
      photos.push(newPhoto);

      return newPhoto;
    }
  },

  Photo: {
    url: (parent) => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: (parent) => users.find((u) => u.githubLogin === parent.githubUser)
  },

  User: {
    postedPhotos: (parent) => photos.filter((p) => p.githubUser === parent.githubLogin)
  }
};

/**
 * 서버 인스턴스를 새로 만듭니다.
 * typeDefs(스키마)와 리졸버를 객체에 넣어 전달합니다.
 */
const server = new ApolloServer({ typeDefs, resolvers });

/** 웹 서버를 구동하기 위해 listen 메서드를 호출합니다. */
server.listen().then(({ url }) => console.log(`GraphQL Service running on ${url}`));
