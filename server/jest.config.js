module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['../server/tests/user.test.js'],
};


module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['../server/tests/like.test.js',
                       '../server/tests/comment.test.js' ,
                      '../server/tests/investment.test.js' ,
                       '../server/tests/community.test.js' ,
                      '../server/tests/communityUsers.test.js' ,
                      '../server/tests/messages.test.js' ,
                      '../server/tests/project.test.js'],
};


