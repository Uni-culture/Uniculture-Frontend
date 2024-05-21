
import Swal from 'sweetalert2';
import axios from "axios";
import api from "../pages/api";

// API 유틸리티 함수 모듈로 정의
export const Api = {
  getToken: () => {
    return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
  },

  GET_API: async (reqUrl, navigate, t) => {
    try {
      const token = Api.getToken();
      const response = await api.get(reqUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: "warning",
          title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('loginWarning.title')}</div>`,
          confirmButtonColor: "#8BC765",
          confirmButtonText: t('loginWarning.confirmButton'),
        }).then(() => {
          navigate("/sign-in");
        });
      }
      console.error(error);
      alert(error.response ? error.response.data : 'An error occurred');
    }
  },

  POST_API: async (reqUrl, bodyData = {}, navigate, t) => {
    try {
      const token = Api.getToken();
      const response = await api.post(reqUrl, bodyData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: "warning",
          title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('loginWarning.title')}</div>`,
          confirmButtonColor: "#8BC765",
          confirmButtonText: t('loginWarning.confirmButton'),
        }).then(() => {
          navigate("/sign-in");
        });
      }
      console.error(error);
      alert(error.response ? error.response.data : 'An error occurred');
    }
  },

  DELETE_API: async (reqUrl, navigate, t) => {
    try {
      const token = Api.getToken();
      const response = await api.delete(reqUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: "warning",
          title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('loginWarning.title')}</div>`,
          confirmButtonColor: "#8BC765",
          confirmButtonText: t('loginWarning.confirmButton'),
        }).then(() => {
          navigate("/sign-in");
        });
      }
      console.error(error);
      alert(error.response ? error.response.data : 'An error occurred');
    }
  },

  FETCH_API: async (reqUrl, navigate, t) => {
    try {
      const token = Api.getToken();
      const response = await api.get(reqUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: "warning",
          title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('loginWarning.title')}</div>`,
          confirmButtonColor: "#8BC765",
          confirmButtonText: t('loginWarning.confirmButton'),
        }).then(() => {
          navigate("/sign-in");
        });
      }
      console.error(error);
      alert(error.response ? error.response.data : 'An error occurred');
    }
  },
};