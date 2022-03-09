import { ellipseAddress } from "../helpers/utilities"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import { emphasize, styled } from "@mui/material/styles"
import Chip from "@mui/material/Chip"

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800]
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  }
})

type ChainType = {
  name?: string
}

const NetworkInfo = ({ chainData, address }: { chainData: ChainType, address: string}): JSX.Element => {
  return (
    <>
      {address && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mr: 2 }}>
          <StyledBreadcrumb label={chainData?.name} />
          <StyledBreadcrumb label={ellipseAddress(address)} />
        </Breadcrumbs>
      )}
    </>
  )
}

export default NetworkInfo