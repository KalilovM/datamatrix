const OrderGeneratedCodesList = ({
	generatedCodes,
}: { generatedCodes: string[] }) => {
	return (
		<div className="table-layout flex flex-col h-full w-1/2">
			<div className="table-header flex justify-between items-center">
				<p className="table-header-title">Агрегированные коды</p>
			</div>
			<div className="table-rows-layout flex-1">
				{generatedCodes.length === 0 ? (
					<p className="text-gray-500 p-4">Нет агрегированных кодов</p>
				) : (
					<ul>
						{generatedCodes.map((code) => (
							<li key={code} className="p-2 border-b border-gray-200">
								{code}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default OrderGeneratedCodesList;
