import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, color, subtitle, highlight }) => {
    const colorClasses = {
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
    };

    return (
        <div className={`bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md duration-300 ${highlight ? 'border-indigo-100 ring-2 ring-indigo-50 dark:border-indigo-900/50 dark:ring-indigo-900/20' : 'border-gray-100 dark:border-zinc-800'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
                {highlight && <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-1 rounded-full uppercase tracking-wide">Key Metric</span>}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{value}</h3>
                {subtitle && <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 mt-1">{subtitle}</p>}
            </div>
        </div>
    );
};

export default KPICard;
