import { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { useConfigService } from "../services/useConfigService";

let navigation = [
  { title: "Inicio", to: "" },
  { title: "Inscritos", to: "inscritos" },
]

export const HeaderNavigation = ({ current }) => {
  const { asPath } = useRouter();
  const { permitirVendinha, permitirRifa, loading } = useConfigService();

  const [firstPage, ..._] = asPath.slice(1)
    .split('/');

  if (permitirVendinha === true && !navigation.some(n => n.to === 'vendinha')) {
    navigation.push({ title: "Vendinha", to: "vendinha" });
  }

  if (permitirRifa === true && firstPage === "rifa") {
    navigation = [{ title: "Rifa", to: "rifa" }];
  }

  navigation
    .forEach(nav => {
      if (nav.to === firstPage) {
        nav.current = true
      }
    })

  return <div className="max-w-7xl mx-auto px-6 xl:px-0">
    <div className="flex flex-col md:flex-row items-center justify-between h-24">
      <div className="flex-shrink-0">
        <img
          className="h-20"
          src="/logo.png"
          alt="Workflow"
        />
      </div>
      <div className="ml-10 flex items-baseline space-x-4 my-4">
        {!loading && navigation.map((item, itemIdx) =>
          <a
            key={item.title}
            href={`/${item.to}`}
            className={classNames(
              item.current
                ? "bg-white text-black"
                : "text-gray-300 hover:bg-gray-700 hover:text-white",
              "transition-all px-3 py-2 rounded-md text-sm font-medium"
            )}
          >
            {item.title}
          </a>
        )}
      </div>
    </div>
  </div>;
}