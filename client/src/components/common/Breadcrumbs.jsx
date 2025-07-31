import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-3 md:mb-8" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />}
          {item.link ? (
            <Link to={item.link} className="hover:text-primary hover:underline whitespace-nowrap">
              {item.name}
            </Link>
          ) : (
            <span className="font-medium text-gray-700 truncate">{item.name}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs; 