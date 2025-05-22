import React, { useState } from "react"
import ModalWrapper from "../ModalWrapper"
import { Dialog } from "@headlessui/react"
import Textbox from "../Textbox"
import { useForm } from "react-hook-form"
import UserList from "./UserList"
import SelectList from "../SelectList"
import { BiImages } from "react-icons/bi"
import { FaFilePdf } from "react-icons/fa"
import Button from "../Button"
import {
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage"
import { storage } from "../../utils/firebase"
import {
    useCreateTaskMutation,
    useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice"
import { toast } from "sonner"
import { dateFormatter } from "../../utils"
import { useSelector } from "react-redux"

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"]
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 3

const uploadedFileURLs = []

const AddTask = ({ open, setOpen, task }) => {
    const { user } = useSelector((state) => state.auth)
    const defaultValues = {
        title: task?.title || "",
        date: dateFormatter(task?.date || new Date()),
        team: [],
        stage: "",
        priority: "",
        assets: [],
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues })

    const [team, setTeam] = useState(task?.team || [])
    const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0])
    const [priority, setPriority] = useState(
        task?.priority?.toUpperCase() || PRIORIRY[2]
    )
    const [assets, setAssets] = useState([])
    const [uploading, setUploading] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([])

    const [createTask, { isLoading }] = useCreateTaskMutation()
    const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()
    const URLS = task?.assets ? [...task.assets] : []

    const handleSelect = (e) => {
        const files = Array.from(e.target.files)
        
        // Check if adding new files would exceed the limit
        if (selectedFiles.length + files.length > MAX_FILES) {
            toast.error(`You can only upload a maximum of ${MAX_FILES} files`)
            return
        }
        
        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
            const isValidSize = file.size <= MAX_FILE_SIZE
            
            if (!isValidType) {
                toast.error(`${file.name} is not a valid file type. Only images and PDFs are allowed.`)
            }
            if (!isValidSize) {
                toast.error(`${file.name} is too large. Maximum file size is 5MB.`)
            }
            
            return isValidType && isValidSize
        })

        setSelectedFiles(prev => [...prev, ...validFiles])
        setAssets(prev => [...prev, ...validFiles])
    }

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
        setAssets(prev => prev.filter((_, i) => i !== index))
    }

    const submitHandler = async (data) => {
        for (const file of assets) {
            setUploading(true)
            try {
                await uploadFile(file)
            } catch (error) {
                console.error("Error uploading file:", error)
                return
            } finally {
                setUploading(false)
            }
        }

        try {
            const newData = {
                ...data,
                assets: [...URLS, ...uploadedFileURLs],
                team,
                stage,
                priority,
            }

            const res = task?._id
                ? await updateTask({ ...newData, _id: task._id }).unwrap()
                : await createTask(newData).unwrap()

            toast.success(res.message)

            setTimeout(() => {
                setOpen(false)
            }, 500)
        } catch (err) {
            console.log(err)
            toast.error(err?.data?.message || err.message)
        }
    }

    const uploadFile = async (file) => {
        try {
            const name = new Date().getTime() + file.name
            const storageRef = ref(storage, name)

            const uploadTask = uploadBytesResumable(storageRef, file)

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        console.log("Upload progress:", progress)
                    },
                    (error) => {
                        console.error("Upload error:", error)
                        toast.error(`Failed to upload ${file.name}: ${error.message}`)
                        reject(error)
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                            uploadedFileURLs.push(downloadURL)
                            resolve()
                        } catch (error) {
                            console.error("Error getting download URL:", error)
                            toast.error(`Failed to get download URL for ${file.name}`)
                            reject(error)
                        }
                    }
                )
            })
        } catch (error) {
            console.error("Error in uploadFile:", error)
            toast.error(`Failed to upload ${file.name}: ${error.message}`)
            throw error
        }
    }

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <Dialog.Title
                        as="h2"
                        className="text-base font-bold leading-6 text-gray-900 mb-4"
                    >
                        {task ? "UPDATE TASK" : "ADD TASK"}
                    </Dialog.Title>

                    <div className="mt-2 flex flex-col gap-6">
                        <Textbox
                            placeholder="Task Title"
                            type="text"
                            name="title"
                            label="Task Title"
                            className="w-full rounded"
                            register={register("title", {
                                required: "Title is required",
                            })}
                            error={errors.title ? errors.title.message : ""}
                        />

                        {user?.isAdmin && <UserList setTeam={setTeam} team={team} />}

                        <div className="flex gap-4">
                            <SelectList
                                label="Task Stage"
                                lists={LISTS}
                                selected={stage}
                                setSelected={setStage}
                            />

                            <div className="w-full">
                                <Textbox
                                    placeholder="Date"
                                    type="date"
                                    name="date"
                                    label="Task Date"
                                    className="w-full rounded"
                                    register={register("date", {
                                        required: "Date is required!",
                                    })}
                                    error={
                                        errors.date ? errors.date.message : ""
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <SelectList
                                label="Priority Level"
                                lists={PRIORIRY}
                                selected={priority}
                                setSelected={setPriority}
                            />

                            <div className="w-full flex flex-col items-center justify-center mt-4">
                                <label
                                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                                    htmlFor="imgUpload"
                                >
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="imgUpload"
                                        onChange={handleSelect}
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        multiple={true}
                                        disabled={selectedFiles.length >= MAX_FILES}
                                    />
                                    <div className="flex items-center gap-2">
                                        <BiImages className="text-xl" />
                                        <FaFilePdf className="text-lg" />
                                        <span className="text-sm">Add Assets (Images & PDFs)</span>
                                    </div>
                                </label>
                                <div className="text-sm text-gray-500">
                                    Maximum {MAX_FILES} files allowed
                                </div>
                                {selectedFiles.length > 0 && (
                                    <div className="mt-2 w-full">
                                        <div className="text-sm font-medium text-gray-700 mb-2">
                                            Selected files ({selectedFiles.length}/{MAX_FILES}):
                                        </div>
                                        <div className="space-y-2">
                                            {selectedFiles.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                    <span className="text-sm text-gray-600 truncate">
                                                        {file.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
                            {uploading ? (
                                <span className="text-sm py-2 text-red-500">
                                    Uploading assets
                                </span>
                            ) : (
                                <Button
                                    label="Submit"
                                    type="submit"
                                    className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                                />
                            )}

                            <Button
                                type="button"
                                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                                onClick={() => setOpen(false)}
                                label="Cancel"
                            />
                        </div>
                    </div>
                </form>
            </ModalWrapper>
        </>
    )
}

export default AddTask
