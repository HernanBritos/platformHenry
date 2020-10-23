const { Post, User, Cohorte } = require("../db");
const { getUserById } = require("./userController");
const{ getEspecificCohorte } = require("./cohorteController");
const { geOneGroup } = require('./groupController');



// Este controller crea un post y los setea a usuario y cohorte
const createPost = async (tittle, content, userId, cohorteId, groupId) => {
   let post = await Post.create(tittle, content);
   if (userId) {
      const user = await getUserById(userId)
      await user.setPost(post);
   } 
   if (cohorteId) {
      const cohorte = await getEspecificCohorte(cohorteId)
      await cohorte.setPost(post)
   }
   if (groupId){
      const group = await getOneGroup(groupId)
      await group.setPost(post)
   }


   return post;
};





// Este controller busca y retorna un post en especifico
const getPost = async (id) => {
   const post = await Post.findByPk(id);
   if (!post) {
      throw {
         name: "ApiFindError",
         type: "Search Error",
         error: {
            message: "post do not find in the database",
            type: "data not found",
            code: 404,
         },
      };
   }
   return post;
};


// Este controller busca y retorna los posts de un cohorte en especifico
const getCohortePosts = async (cohorteId) => {
   const posts = await Post.findAll({where: {cohorteId}});
   if (!posts) {
      throw {
         name: "ApiFindError",
         type: "Search Error",
         error: {
            message: "there are no posts in the database for this cohorte",
            type: "data not found",
            code: 404,
         },
      };
   }
   return posts;
};


// Este controller edita un post
const editPost = async (id, { tittle, content }) => {
   const post = await getPost({ id });
   return await group.update({ tittle, content });
};


// Este controller elimina un post
const deletePost = async (id) => {
   const post = await getPost(id);
   await post.destroy();

   return { message: "successfully removed" };
};

//Este controller retorna todos los posts
const getAllPosts = async () => {
   return await Post.findAll();
};

// Este controller retorna todos los posts que ha hecho una persona
const getUserPosts = async (userId) => {
   const posts = await Post.findAll({where: {userId}})
   if (!posts) {
      throw {
         name: "ApiFindError",
         type: "Search Error",
         error: {
            message: "this user does not have posts",
            type: "data not found",
            code: 404,
         },
      };
   }

   return posts
}

const getGroupPosts = async (groupId) => {
   const posts = await Post.findAll({where: {groupId}});
   if (!posts) {
      throw {
         name: "ApiFindError",
         type: "Search Error",
         error: {
            message: "there are no posts in the database for this cohorte",
            type: "data not found",
            code: 404,
         },
      };
   }
   return posts;
};

module.exports = {
   createPost,
   getPost,
   getCohortePosts,
   editPost,
   deletePost,
   getAllPosts,
   getUserPosts,
   getGroupPosts,
  }