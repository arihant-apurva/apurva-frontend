
// import * as React from 'react';
// import Breadcrumbs from '@mui/material/Breadcrumbs';
// import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';
// import Stack from '@mui/material/Stack';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// import { useNavigate, useLocation } from 'react-router-dom';
// import '../asset/css/Breadcrumbs.css';

// export default function CustomSeparator() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const breadcrumbMap = {
//     '/admin/content-type': 'List',
//     '/admin/content-type/add': 'Add',
//     '/admin/content-type/update': 'Update',
//     '/admin/content-type/view': 'View',
//   };

//   const getCurrentBreadcrumb = () => {
//     const pathSegments = location.pathname.split('/').filter((x) => x);
//     const basePath = `/${pathSegments.slice(0, 3).join('/')}`;
//     return breadcrumbMap[basePath] || 'List';
//   };

//   const currentBreadcrumb = getCurrentBreadcrumb();

//   function handleClick(event, path) {
//     event.preventDefault();
//     navigate(path);
//   }

//   const breadcrumbs = [
//     <Link
//       underline="hover"
//       key="1"
//       href="/"
//       onClick={(e) => handleClick(e, '/')}
//     >
//       Home
//     </Link>,
//     <Link
//       underline="hover"
//       key="2"
//       href="/admin/content-type"
//       onClick={(e) => handleClick(e, '/admin/content-type')}
//     >
//       Content-Type
//     </Link>,
//     <Typography key="3">{currentBreadcrumb}</Typography>,
//   ];

//   return (
//     <Stack spacing={2} className="breadcrumbs-container">
//       <Breadcrumbs
//         separator={<NavigateNextIcon fontSize="small" />}
//         aria-label="breadcrumb"
//       >
//         {breadcrumbs}
//       </Breadcrumbs>
//     </Stack>
    
//   );

// }

import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../asset/css/Breadcrumbs.css';

export default function CustomSeparator({ baseRoute }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Capitalize the first letter of a word
  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  // Generate breadcrumbs dynamically based on the pathname
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = [];
    let accumulatedPath = '';

    pathSegments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      breadcrumbs.push(
        isLast ? (
          <Typography key={index} sx={{ color: 'text.primary' }}>
            {capitalize(segment.replace(/-/g, ' '))}
          </Typography>
        ) : (
          <Link
            underline="hover"
            key={index}
            href={accumulatedPath}
            onClick={(e) => handleClick(e, accumulatedPath)}
          >
            {capitalize(segment.replace(/-/g, ' '))}
          </Link>
        )
      );
    });

    return breadcrumbs;
  };

  function handleClick(event, path) {
    event.preventDefault();
    navigate(path);
  }

  return (
    <Stack spacing={2} className="breadcrumbs-container">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          underline="hover"
          key="home"
          href="/"
          onClick={(e) => handleClick(e, '/')}
        >
          Home
        </Link>
        {generateBreadcrumbs()}
      </Breadcrumbs>
    </Stack>
  );
}
