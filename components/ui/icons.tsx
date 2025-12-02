    // فایل: components/ui/icons.tsx

    import { type SVGProps } from 'react';

    export function IconSpinner(props: SVGProps<SVGSVGElement>) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      );
    }

    

export function IconArrowElbow({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M15 3H7a4 4 0 0 0-4 4v10" />
      <path d="m10 12-5 5 5 5" />
    </svg>
  )
}


    export function IconCopy(props: SVGProps<SVGSVGElement>) {
      return (
        <svg
          {...props}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      );
    }

    export function IconCheck(props: SVGProps<SVGSVGElement>) {
      return (
        <svg
          {...props}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    }

    export function IconUser(props: SVGProps<SVGSVGElement>) {
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
    }

    // You can use a different icon for the AI if you prefer
    export function IconVercel(props: SVGProps<SVGSVGElement>) {
      return (
        <svg
          {...props}
          fill="none"
          shapeRendering="geometricPrecision"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M3.72 3.72a2.46 2.46 0 013.48 0L12 8.5l4.8-4.78a2.46 2.46 0 013.48 3.48L15.48 12l4.78 4.8a2.46 2.46 0 01-3.48 3.48L12 15.48l-4.8 4.78a2.46 2.46 0 01-3.48-3.48L8.52 12 3.72 7.2A2.46 2.46 0 013.72 3.72z" />
        </svg>
      )
    }
