const Query = require('./Query');
const Mutation = require('./Mutation');
const Type = require('./Type');

type PhotoType = {
  id: string;
  name: string;
  description?: string;
  category: string;
  githubUser: string;
  created: string;
};

type UserType = {
  githubLogin: string;
  name: string;
};

type TagType = {
  photoID: string;
  userID: string;
};

/** 메모리에 사진을 저장할 떄 사용할 데이터 타입 */
const photos: PhotoType[] = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'gPlake',
    created: '3-28-1997'
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt',
    created: '1-2-1985'
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt',
    created: '2018-04-15T19:09:58.308Z'
  }
];

const users: UserType[] = [
  { githubLogin: 'mHattrup', name: 'Mike Hattrup' },
  { githubLogin: 'gPlake', name: 'Glen Plake' },
  { githubLogin: 'sSchmidt', name: 'Scot Schmidt' }
];

const tags: TagType[] = [
  { photoID: '1', userID: 'gPlake' },
  { photoID: '2', userID: 'sSchmidt' },
  { photoID: '2', userID: 'mHattrup' },
  { photoID: '2', userID: 'gPlake' }
];

const resolvers = {
  Query,
  Mutation,
  ...Type
};

module.exports = resolvers;
