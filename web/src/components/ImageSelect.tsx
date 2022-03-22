import { useState } from "react"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"

export const ImageSelect = ({
  image,
  setImage,
}: {
  image: { name: string, size: string } | null
  setImage: (image: { name: string, size: string }) => void
}) => {
  const [imagePreview, setImagePreview] = useState("")

  const createPreview = (e: any) => {
    if (e.target.value !== "") {
      setImage(e.target.files[0])
      const src = URL.createObjectURL(e.target.files[0])
      setImagePreview(src)
    } else {
      setImagePreview("")
    }
  }

  return (
    <div>
      <Box component="form">
        <label htmlFor="upload-photo">
          <input
            style={{ display: "none" }}
            id="upload-photo"
            name="upload-photo"
            type="file"
            onChange={(e: any) => createPreview(e)}
          />
          <Button variant="outlined" size="medium" component="span">
            Image
          </Button>
        </label>
        {imagePreview !== "" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <br />
            <img
              style={{ maxWidth: "100%", maxHeight: 300 }}
              src={imagePreview}
              alt="upload nft"
            />
            <h5>
              {image!.name} <Chip sx={{ ml: 1 }} label={`${image!.size} kb`} />
            </h5>
          </div>
        )}
      </Box>
    </div>
  )
}
