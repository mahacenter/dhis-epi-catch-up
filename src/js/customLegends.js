export const CUSTOM_LEGENDS = [
    {
        id: 'custom-epi-ghana',
        name: 'EPI GHANA',
        displayName: 'EPI GHANA',
        legends: [
            {
                id: 'custom-epi-ghana-red',
                name: 'Cumulative < 50',
                displayName: 'Cumulative < 50',
                color: '#e2494f',
                startValue: 0,
                endValue: 49,
                hideRangeValues: true,
            },
            {
                id: 'custom-epi-ghana-yellow',
                name: '50 =< Cumulative < 80',
                displayName: '50 =< Cumulative < 80',
                color: '#fffad4',
                startValue: 50,
                endValue: 79,
                hideRangeValues: true,
            },
            {
                id: 'custom-epi-ghana-green',
                name: '80 =< Cumulative < 90',
                displayName: '80 =< Cumulative < 90',
                color: '#cae599',
                startValue: 80,
                endValue: 89,
                hideRangeValues: true,
            },
            {
                id: 'custom-epi-ghana-cyan',
                name: '90 =< Cumulative < 95',
                displayName: '90 =< Cumulative < 95',
                color: '#99cb93',
                startValue: 90,
                endValue: 94,
                hideRangeValues: true,
            },
            {
                id: 'custom-epi-ghana-blue',
                name: 'Cumulative >= 95',
                displayName: '90 =< Cumulative < 95',
                color: '#468e6d',
                startValue: 95,
                endValue: 1000,
                hideRangeValues: true,
            },
        ]
    }
]
