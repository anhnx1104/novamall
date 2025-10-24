import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Person } from "@styled-icons/bootstrap";
import { Avatar } from "@mui/material";
import { Iconify } from "~/components/iconify";
import { useTranslation } from "react-i18next";

export function AccountPopover({ sx, ...other }) {
  const router = useRouter();
  const { t } = useTranslation();
  const data = [
    {
      label: t("View Website"),
      href: "/",
      icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
    },
    {
      label: t("Profile"),
      href: "#",
      icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
    },
    {
      label: t("Settings"),
      href: "#",
      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
    },
  ];
  const pathname = usePathname();
  const { session } = useSelector((state) => state.localSession);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path) => {
      handleClosePopover();
      router.push(path);
    },
    [handleClosePopover, router]
  );

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: "2px",
          width: 40,
          height: 40,
          ...sx,
        }}
        {...other}
      >
        <Avatar
          src={"/assets/images/avatar/avatar-4.webp"}
          alt={session.user.name}
          sx={{ width: 1, height: 1 }}
        >
          {session.user.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { width: 200 },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {session.user.name}
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {session.user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuList
          disablePadding
          sx={{
            p: 1,
            gap: 0.5,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
              [`&.${menuItemClasses.selected}`]: {
                color: "text.primary",
                bgcolor: "action.selected",
                fontWeight: "fontWeightSemiBold",
              },
            },
          }}
        >
          {data.map((option) => (
            <MenuItem
              key={option.label}
              selected={option.href === pathname}
              onClick={() => handleClickItem(option.href)}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth color="error" size="medium" variant="text">
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
}
