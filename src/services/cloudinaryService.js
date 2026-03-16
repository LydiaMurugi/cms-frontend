/**
 * Service to handle uploads to Cloudinary
 */
import axios from 'axios'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const uploadImage = async (file) => {
  if (!file) return null

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    )
    
    // Return the secure URL of the uploaded image
    return response.data.secure_url
  } catch (error) {
    console.error('Cloudinary Upload Error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

/**
 * Helper to get optimized Cloudinary URL
 * Example: Transform to 400px width, auto quality
 */
export const getOptimizedUrl = (url, width = 400) => {
  if (!url || !url.includes('cloudinary')) return url
  
  // Basic transformation: w_width,c_scale,q_auto,f_auto
  return url.replace('/upload/', `/upload/w_${width},c_scale,q_auto,f_auto/`)
}
