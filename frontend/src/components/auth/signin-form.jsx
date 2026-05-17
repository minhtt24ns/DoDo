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

const signInSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 kí tự"),
  password: z.string().min(1, "Mật khẩu không được để trống").min(6, "Mật khẩu phải có ít nhất 6 kí tự"),
})

/** @typedef {z.infer<typeof signInSchema>} SignInFormValues */

export function SigninForm({
  className,
  ...props
}) {

 //Sử dụng zustand
  const {signIn} = useAuthStore()

  //Sử dụng react router
  const navigate = useNavigate()

 const {register, handleSubmit, formState: {errors,isSubmitting}} = useForm({
  resolver: zodResolver(signInSchema)
 })

 /** @param {SignInFormValues} data */
 const onSubmit = async (data) => {
  const {username,password} = data

  await signIn(username,password)
  navigate('/')
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
                <h1 className="text-2xl font-bold">Đăng nhập vào tài khoản DoDo</h1>
                <p className="text-muted-foreground text-balance">
                  Chào mừng trở lại! Hãy nhập thông tin của bạn.</p>
              </div>
              {/* Tên đăng nhập */}
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
              {/* button - đăng nhập */}
              <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              >
                Đăng nhập
              </Button>
              <div className="text-center text-sm">
                Bạn chưa có tài khoản? 
                {" "}
                <a href="/signup" className="underline underline-offset-4">Đăng ký</a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.png"
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