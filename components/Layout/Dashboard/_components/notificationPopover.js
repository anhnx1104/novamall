import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import { Iconify } from "~/components/iconify";

// ----------------------------------------------------------------------

export function NotificationsPopover({ data = [], sx, ...other }) {
  const _notifications = [
    {
      id: 1,
      title: "주문이 접수되었습니다",
      description: "배송 대기 중입니다",
      avatarUrl: null,
      type: "order-placed",
      postedAt: "2023/08/11",
      isUnRead: true,
    },
    {
      id: 2,
      title: "Minimal에 대한 댓글에 답변이 달렸습니다",
      description: "Minimal에 대한 댓글에 답변이 달렸습니다",
      avatarUrl: "/assets/images/avatar/avatar-4.webp",
      type: "friend-interactive",
      postedAt: "2023/08/11",
      isUnRead: true,
    },
    {
      id: 3,
      title: "새로운 메시지가 있습니다",
      description: "읽지 않은 메시지 5개",
      avatarUrl: null,
      type: "chat-message",
      postedAt: "2023/08/11",
      isUnRead: false,
    },
    {
      id: 4,
      title: "새로운 메일이 도착했습니다",
      description: "기UDO 파드버그로부터 보낸 메일",
      avatarUrl: null,
      type: "mail",
      postedAt: "2023/08/11",
      isUnRead: false,
    },
    {
      id: 5,
      title: "배송 처리 중",
      description: "주문하신 상품이 배송 중입니다",
      avatarUrl: null,
      type: "order-shipped",
      postedAt: "2023/08/11",
      isUnRead: false,
    },
    {
      id: 6,
      title: "새로운 팔로워",
      description: "소셜 미디어에 새로운 팔로워가 있습니다",
      avatarUrl: "/assets/images/avatar/avatar-2.webp",
      type: "friend-interactive",
      postedAt: "2023/07/11",
      isUnRead: false,
    },
    {
      id: 7,
      title: "결제가 완료되었습니다",
      description: "결제가 성공적으로 처리되었습니다",
      avatarUrl: null,
      type: "payment",
      postedAt: "2023/07/11",
      isUnRead: false,
    },
    {
      id: 8,
      title: "서버 과부하",
      description: "서버에 과부하가 발생하고 있습니다",
      avatarUrl: null,
      type: "server",
      postedAt: "2023/06/11",
      isUnRead: false,
    },
    {
      id: 9,
      title: "주간 보고서",
      description: "주간 활동 보고서가 준비되었습니다",
      avatarUrl: null,
      type: "report",
      postedAt: "2023/06/11",
      isUnRead: false,
    },
    {
      id: 10,
      title: "새로운 댓글",
      description: "게시물에 누군가 댓글을 남겼습니다",
      avatarUrl: "/assets/images/avatar/avatar-3.webp",
      type: "comment",
      postedAt: "2023/05/11",
      isUnRead: false,
    },
  ];
  const [notifications, setNotifications] = useState(_notifications);

  const totalUnRead = notifications.filter(
    (item) => item.isUnRead === true
  ).length;

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isUnRead: false,
    }));

    setNotifications(updatedNotifications);
  }, [notifications]);

  return (
    <>
      <IconButton
        color={openPopover ? "primary" : "default"}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <Box
          sx={{
            py: 2,
            pl: 2.5,
            pr: 1.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">알림</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              읽지 않은 알림 {totalUnRead}개가 있습니다
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="모두 읽음으로 표시">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box
          sx={{
            maxHeight: 320,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: "overline" }}
              >
                새로운 알림
              </ListSubheader>
            }
          >
            {notifications.slice(0, 5).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: "overline" }}
              >
                이전 알림
              </ListSubheader>
            }
          >
            {notifications.slice(5).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </List>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />
        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple color="inherit">
            모두 보기
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({ notification }) {
  const { avatarUrl, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        ...(notification.isUnRead && {
          bgcolor: "action.selected",
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{avatarUrl}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              gap: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <Iconify width={14} icon="solar:clock-circle-outline" />
            {notification.postedAt}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography
        component="span"
        variant="body2"
        sx={{ color: "text.secondary" }}
      >
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );

  if (notification.type === "order-placed") {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === "order-shipped") {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === "mail") {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-mail.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === "chat-message") {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-chat.svg"
        />
      ),
      title,
    };
  }
  return {
    avatarUrl: notification.avatarUrl ? (
      <img alt={notification.title} src={notification.avatarUrl} />
    ) : null,
    title,
  };
}
