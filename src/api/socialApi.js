import axios from 'axios';
import { API_BASE_URL } from '../api'; // Assurez-vous que le chemin est correct
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

import { uploadFile } from '../tools/tools'

export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/social/posts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors du chargement des posts');
  }
};

export const createPost = async (postData) => {

  let urlFile = []
  let links = [...postData.links]

  // Ajout des fichiers

  for (const file of postData.files) {
    console.log(file)
    const cFile = await uploadFile(file, 'socialMedia')
    urlFile.push(cFile)
  }

  // Ajout des liens
  // postData.links.forEach(link => {
  //   links.push(link);
  // });

  const postContent = {
    'content': postData.content,
    'isArticle': postData.isArticle,
    'articleTitle': postData.articleTitle,
    'urlFile': urlFile,
    'idUser': postData.idUser,
    'links': links.length > 0 ? links : []

  }

  console.log(postContent);

  try {
    const response = await axios.post(`${API_BASE_URL}/social/posts`, postContent, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la création du post');
  }
};

// Dans socialApi.js
export const fetchMorePosts = async (page) => {
  const response = await axios.get(`${API_BASE_URL}/social/posts?page=${page}`);
  return response.data;
};

// Ajout d'une réaction
export const addReaction = async (postId, type, userId) => {
  console.log(type)
  const response = await axios.post(

    `${API_BASE_URL}/social/posts/${postId}/reaction`,
    { type, userId },
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
};

// Ajout d'un commentaire
export const addComment = async (postId, content, userId) => {
  const response = await axios.post(
    `${API_BASE_URL}/social/posts/${postId}/comment`,
    { content, userId }, 
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
};

// Ajout d'une réaction à un commentaire
export const addCommentReaction = async (postId, commentId, type, userId) => {
  const response = await axios.post(
    `${API_BASE_URL}/social/posts/${postId}/comment/${commentId}/reaction`,
    { type, userId },
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
};

// Ajout d'une réponse à un commentaire
export const replyToComment = async (postId, commentId, content, userId) => {
  const response = await axios.post(
    `${API_BASE_URL}/social/posts/${postId}/comment/${commentId}/reply`,
    { content, userId },
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
};

// Ajout d'une réaction à une réponse
export const addReplyReaction = async (postId, commentId, replyId, type, userId) => {
  const response = await axios.post(
    `${API_BASE_URL}/social/posts/${postId}/comment/${commentId}/reply/${replyId}/reaction`,
    { type, userId },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
};

export const updatePost = async (postId, postData) => {
  let urlFile = [];
  let links = [...postData.links];

  for (const file of postData.files) {
    const cFile = await uploadFile(file, 'socialMedia');
    urlFile.push(cFile);
  }

  const postContent = {
    content: postData.content,
    isArticle: postData.isArticle,
    articleTitle: postData.articleTitle,
    urlFile: urlFile,
    idUser: postData.idUser,
    links: links.length > 0 ? links : []
  };

  try {
    const response = await axios.put(`${API_BASE_URL}/social/posts/${postId}`, postContent, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la modification du post');
  }
};