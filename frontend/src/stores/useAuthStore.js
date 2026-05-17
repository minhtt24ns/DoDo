import {create} from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";

export const useAuthStore = create((set,get) => ({
  accessToken: null,
  user: null,
  loading:false,


  setAccessToken: (accessToken) => {
    set({accessToken});
  },

  // Xóa state
  clearState: () => {
    set({accessToken: null, user: null, loading:false});
  },

  // Đăng ký
  signUp: async(username,email,password,firstName,lastName) =>{
    try{
      set({loading:true})
      
      // gọi api
      await authService.signUp(username,email,password,firstName,lastName)

      toast.success("Đăng ký thành công ! Bạn sẽ được chuyển sang trang đăng nhập")
    }
    catch(error){
      console.log(error)
      toast.error("Đăng ký không thành công")
    }
    finally{
      set({loading:false})
    }
  },

  signIn: async(username, password) =>{
    try{
      set({loading:true})

      const data = await authService.signIn(username,password)

      get().setAccessToken(accessToken)

      await get().fetchMe()

      const currentUser = get().user;
      toast.success(`Đăng nhập thành công! Chào mừng trở lại ${currentUser?.displayName || 'bạn'}`)
    }
    catch(error){
      console.log(error)
      toast.error("Đăng nhập không thành công")
    }
    finally{
      set({loading:false})
    }
  },
  // sign out
  signOut: async() => {
    try{
      get().clearState()

      await authService.signOut()

      toast.success("Đăng xuất thành công")
    }
    catch(error){
      console.log(error)
      toast.error("Đăng xuất không thành công")
    }
  },
  // fetch user
  fetchMe: async() => {
    try{
      set({loading:true})

      const user = await authService.fetchMe()

      set({user})
    }
    catch(error){
      console.log(error)
      set({accessToken: null, user: null})
      toast.error("Không thể lấy thông tin user")
    }
    finally{
      set({loading:false})
    }
  },
  // refresh token
  refresh: async () => {
    try{
      set({loading: true});
      
      const {user,fetchMe, setAccessToken} = get();
      const accessToken = await authService.refresh();
      setAccessToken(accessToken);

      // sau khi refresh token thành công thì fetch lại thông tin user
      if (!user) {
        await fetchMe();
      }
    }
    catch(error){
      console.error(error);
      get().clearState();
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    finally{
      set({loading: false});
    }
  }
}))