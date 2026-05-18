import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {z} from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router"


const signUpSchema = z.object({
  lastname: z.string().min(1, "Họ không được để trống"),
  firstname: z.string().min(1, "Tên không được để trống"),
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 kí tự"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống").min(3, "Mật khẩu phải có ít nhất 3 kí tự"),
})

/** @typedef {z.infer<typeof signUpSchema>} SignUpFormValues */

export function SignupForm({
  className,
  ...props
}) {

  const {signUp} = useAuthStore()
  const navigate = useNavigate()

 const {register, handleSubmit, formState: {errors,isSubmitting}} = useForm({
  resolver: zodResolver(signUpSchema)
 })

 // Xử lý form
 /** @param {SignUpFormValues} data */
 const onSubmit = async (data) => {
  const {username,email,password,firstname,lastname} = data
  await signUp(username,email,password,firstname,lastname)
  navigate('/signin')
 }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col gap-2 items-center text-center">
                <a href="/"
                  className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" />
                </a>
                <h1 className="text-2xl font-bold">Tạo tài khoản DoDo</h1>
                <p className="text-muted-foreground text-balance">
                  Nhập thông tin của bạn để bắt đầu</p>
              </div>
              {/* Họ và tên */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label 
                  htmlFor="lastname" 
                  className="block text-sm">Họ</Label>
                  <Input 
                  id="lastname" 
                  type="text"  
                  {...register("lastname")}/>
                  {errors.lastname && (<p className="text-sm text-destructive">{errors.lastname.message}</p>)}
                </div>
                <div className="space-y-2">
                  <Label 
                  htmlFor="firstname" 
                  className="block text-sm">Tên</Label>
                  <Input 
                  id="firstname" 
                  type="text" 
                  {...register("firstname")}/>
                  {errors.firstname && (<p className="text-sm text-destructive">{errors.firstname.message}</p>)}
                </div>
              </div>
              {/* username */}
              <div className="flex flex-col gap-3">
                <Label 
                htmlFor="username" 
                className="block text-sm">Tên đăng nhập</Label>
                <Input 
                id="username" 
                type="text" 
                {...register("username")}/>
                {errors.username && (<p className="text-sm text-destructive">{errors.username.message}</p>)}
              </div>
              {/* Email */}
              <div className="flex flex-col gap-3">
                <Label 
                htmlFor="email" 
                className="block text-sm">Email</Label>
                <Input 
                id="email" 
                type="email" 
                {...register("email")}/>
                {errors.email && (<p className="text-sm text-destructive">{errors.email.message}</p>)}
              </div>
              {/* Mật khẩu */}
              <div className="flex flex-col gap-3">
                <Label 
                htmlFor="password" 
                className="block text-sm">Mật khẩu</Label>
                <Input 
                id="password" 
                type="password" 
                {...register("password")}/>
                {errors.password && (<p className="text-sm text-destructive">{errors.password.message}</p>)}
              </div>
              {/* button - đăng ký */}
              <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              >
                Tạo tài khoản
              </Button>
              <div className="text-center text-sm">
                Bạn đã có tài khoản? 
                {" "}
                <a href="/signin" className="underline underline-offset-4">Đăng nhập</a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover" />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offetset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
}
