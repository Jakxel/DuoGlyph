import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'secondary2';
    selected?: boolean;
};

const buttonStyles: Record<string, React.CSSProperties> = {
    primary: {
        backgroundColor: '#ee4545ff',
        color: '#fff',
        width: "6rem",
        border: 'none',
        borderRadius: '4px',
        fontSize: "25px",
        padding: '8px 16px',
        fontWeight: 600,
        cursor: 'pointer',
        margin: '10px',
        transition: 'background 0.2s',
    },
    secondary: {
        backgroundColor: '#e5e7eb',
        color: '#1f2937',
        border: 'none',
        width: "6rem",
        borderRadius: '4px',
        padding: '8px 16px',
        fontSize: "25px",
        fontWeight: 600,
        cursor: 'pointer',
        margin: '10px',
        transition: 'background 0.2s',
    },
    secondary2: {
        backgroundColor: '#ffc653ff',
        color: '#ffffffff',
        border: 'none',
        width: "6rem",
        borderRadius: '4px',
        padding: '8px 16px',
        fontSize: "25px",
        fontWeight: 600,
        cursor: 'pointer',
        margin: '10px',
        transition: 'background 0.2s',
    },
    selected: {
        boxShadow: '0 0 0 4px #ffc400ff',
        outline: 'none',
    },
};

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    style,
    selected = false,
    ...props
}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const getHoverStyle = () => {
        if (variant === 'primary' && isHovered) {
            return { backgroundColor: '#a20000ff' };
        }
        if (variant === 'secondary' && isHovered) {
            return { backgroundColor: '#d1d5db' };
        }
        return {};
    };

    return (
        <button
            style={{
                ...buttonStyles[variant],
                ...(selected ? buttonStyles.selected : {}),
                ...getHoverStyle(),
                ...style,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;