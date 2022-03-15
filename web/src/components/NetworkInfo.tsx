import { ellipseAddress } from "../helpers/utilities"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import { emphasize, styled } from "@mui/material/styles"
import Chip from "@mui/material/Chip"

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    backgroundColor: theme.palette.common.white,
    height: theme.spacing(3),
    color: theme.palette.common.black,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(theme.palette.common.white, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.common.white, 0.12),
    },
  }
})

type ChainType = {
  name?: string
}

const NetworkInfo = ({
  chainData,
  address,
}: {
  chainData: ChainType
  address: string
}): JSX.Element => {
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
