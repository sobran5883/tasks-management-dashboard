import React from "react"
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import ModalWrapper from "./ModalWrapper"
import { Dialog } from "@headlessui/react"
import Textbox from "./Textbox"
import Loading from "./Loader"
import Button from "./Button"
import { useRegisterMutation } from "../redux/slices/api/authApiSlice"
import { toast } from "sonner"
import { useUpdateUserMutation } from "../redux/slices/api/userApiSlice"
import { setCredentials } from "../redux/slices/authSlice"

const AddUser = ({ open, setOpen, userData }) => {
    const { user } = useSelector((state) => state.auth)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm()

    // Reset form when modal opens/closes
    React.useEffect(() => {
        if (open) {
            if (userData) {
                // For editing user
                reset({
                    name: userData.name || "",
                    title: userData.title || "",
                    email: userData.email || "",
                    role: userData.role || "",
                })
            } else {
                // For new user - reset to empty values
                reset({
                    name: "",
                    title: "",
                    email: "",
                    role: "",
                    password: "",
                })
            }
        }
    }, [open, userData, reset])

    const dispatch = useDispatch()

    const [addNewUser, { isLoading }] = useRegisterMutation()
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

    const handleOnSubmit = async (data) => {
        try {
            if (userData) {
                // For updating user
                const updateData = {
                    ...data,
                    _id: userData._id, // Include the user ID
                    password: data.password || undefined // Only include password if it was changed
                }
                const result = await updateUser(updateData).unwrap()

                toast.success("Profile updated successfully.")

                if (userData?._id === user._id) {
                    dispatch(setCredentials({ ...result.user }))
                }
            } else {
                // For new user registration
                await addNewUser({
                    ...data,
                    password: data.password,
                }).unwrap()

                toast.success("New user added successfully.")
            }

            setTimeout(() => {
                setOpen(false)
            }, 1500)
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong.")
        }
    }

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(handleOnSubmit)} className="">
                    <Dialog.Title
                        as="h2"
                        className="text-base font-bold leading-6 text-gray-900 mb-4"
                    >
                        {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
                    </Dialog.Title>
                    <div className="mt-2 flex flex-col gap-6">
                        <Textbox
                            placeholder="Full name"
                            type="text"
                            name="name"
                            label="Full Name"
                            className="w-full rounded"
                            register={register("name", {
                                required: "Full name is required!",
                            })}
                            error={errors.name ? errors.name.message : ""}
                        />
                        <Textbox
                            placeholder="Title"
                            type="text"
                            name="title"
                            label="Title"
                            className="w-full rounded"
                            register={register("title", {
                                required: "Title is required!",
                            })}
                            error={errors.title ? errors.title.message : ""}
                        />
                        <Textbox
                            placeholder="Email Address"
                            type="email"
                            name="email"
                            label="Email Address"
                            className="w-full rounded"
                            register={register("email", {
                                required: "Email Address is required!",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            error={errors.email ? errors.email.message : ""}
                        />

                        <Textbox
                            placeholder="Role"
                            type="text"
                            name="role"
                            label="Role"
                            className="w-full rounded"
                            register={register("role", {
                                required: "User role is required!",
                            })}
                            error={errors.role ? errors.role.message : ""}
                        />

                        {/* Password field for new user */}
                        {!userData && (
                            <Textbox
                                placeholder="Password"
                                type="password"
                                name="password"
                                label="Password"
                                className="w-full rounded"
                                register={register("password", {
                                    required: "Password is required!",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                error={errors.password ? errors.password.message : ""}
                            />
                        )}

                        {/* Password fields for updating user */}
                        {userData && (
                            <>
                                <Textbox
                                    placeholder="New Password (optional)"
                                    type="password"
                                    name="password"
                                    label="New Password"
                                    className="w-full rounded"
                                    register={register("password", {
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                    error={errors.password ? errors.password.message : ""}
                                />
                                <Textbox
                                    placeholder="Confirm New Password"
                                    type="password"
                                    name="confirmPassword"
                                    label="Confirm New Password"
                                    className="w-full rounded"
                                    register={register("confirmPassword", {
                                        validate: value => 
                                            !watch("password") || value === watch("password") || 
                                            "Passwords do not match"
                                    })}
                                    error={errors.confirmPassword ? errors.confirmPassword.message : ""}
                                />
                            </>
                        )}
                    </div>

                    {isLoading || isUpdating ? (
                        <div className="py-5">
                            <Loading />
                        </div>
                    ) : (
                        <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
                            <Button
                                type="submit"
                                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                                label="Submit"
                            />

                            <Button
                                type="button"
                                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                                onClick={() => setOpen(false)}
                                label="Cancel"
                            />
                        </div>
                    )}
                </form>
            </ModalWrapper>
        </>
    )
}

export default AddUser
