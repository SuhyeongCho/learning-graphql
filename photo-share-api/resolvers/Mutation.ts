const { client_id, client_secret } = require('../clientID.json');

/** 고유 ID를 만들기 위해 값을 하나씩 증가시킬 변수입니다. */
let _id = 0;

global.fetch = require('node-fetch');

const requestGithubToken = (credentials) =>
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(JSON.stringify(error));
    });

const requestGithubUserAccount = (token) =>
  fetch(`https://api.github.com/user?access_token=${token}`)
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(JSON.stringify(error));
    });

async function authorizeWithGithub(credentials) {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return { ...githubUser, access_token };
}

const githubAuth = async (parent, { code }, { db }) => {
  /** 깃허브에서 데이터를 받아옵니다. */
  let {
    message,
    access_token,
    avatar_url,
    login,
    name
  } = await authorizeWithGithub({
    client_id,
    client_secret,
    code
  });
  /** 메세지가 있다면 무언가 잘못된 것입니다. */
  if (message) throw new Error(message);

  /** 결과 값을 하나의 객체 안에 담습니다. */
  let latestUserInfo = {
    name,
    githubLogin: login,
    githubToken: access_token,
    avatar: avatar_url
  };

  /** 데이터를 새로 추가하거나 이미 있는 데이터를 업데이트합니다. */
  const {
    ops: [user]
  } = await db
    .collection('users')
    .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });

  /** 사용자 데이터와 토큰을 반환합니다. */
  return { user, token: access_token };
};

module.exports = {
  postPhoto(parent, args) {
    /** 새로운 사진을 만들고 id를 부여합니다. */
    const newPhoto = {
      id: _id++,
      ...args.input,
      created: new Date()
    };
    photos.push(newPhoto);
    return newPhoto;
  },
  githubAuth
};
