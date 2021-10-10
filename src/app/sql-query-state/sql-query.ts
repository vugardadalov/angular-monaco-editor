


export const SqlRegex = 'SELECT|CREATE|DELETE|ALTER|DROP|TRUNCATE|INSERT|UPDATE|DESC';

// // temp1.trigger('Hello', 'editor.action.triggerSuggest', 'Hello');

export const SqlQuery = `
SELECT * FROM test

SELECT * FROM hello123;
`

export const SqlQuery2 = `
SELECT 
    call.*,
    DATEDIFF("SECOND", call.start_time, call.end_time) AS call_duration
FROM call
ORDER BY
    call.employee_id ASC,
    call.start_time ASC;

Select * from Employee a where rowid <>( select max(rowid) 
from Employee b where a.Employee_num=b.Employee_num);

Select * from Employee where Rowid= select min(Rowid) 
from Employee;

Select * from Employee e where rownum <=5
union
select * from (Select * from Employee e order by rowid desc) where rownum <=5;

select distinct salary from employee a where 3 >= (select count(distinct salary) 
from employee b where a.salary <= b.salary) 
order by a.salary desc;


SELECT column_name(s)
FROM table_name
WHERE column_name BETWEEN value_1 AND value_2;

SELECT 
	country.country_name_eng,
	SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls,
	AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
FROM country 
LEFT JOIN city ON city.country_id = country.id
LEFT JOIN customer ON city.id = customer.city_id
LEFT JOIN call ON call.customer_id = customer.id
GROUP BY 
	country.id,
	country.country_name_eng
ORDER BY calls DESC, country.id ASC;


CREATE TABLE table_name (
  column_1 datatype, 
  column_2 datatype, 
  column_3 datatype
);


DELETE FROM table_name
WHERE some_column = some_value;

SELECT 
	country.country_name_eng,
	SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls,
	AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
FROM country 
LEFT JOIN city ON city.country_id = country.id
LEFT JOIN customer ON city.id = customer.city_id
LEFT JOIN call ON call.customer_id = customer.id
GROUP BY 
	country.id,
	country.country_name_eng
HAVING AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) > (SELECT AVG(DATEDIFF(SECOND, call.start_time, call.end_time)) FROM call)
ORDER BY calls DESC, country.id ASC;

-- the query returns a call summary for countries having average call duration > average call duration of all calls
SELECT 
    country.country_name_eng,
    SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls,
    AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
FROM country 
-- we've used left join to include also countries without any call
LEFT JOIN city ON city.country_id = country.id
LEFT JOIN customer ON city.id = customer.city_id
LEFT JOIN call ON call.customer_id = customer.id
GROUP BY 
    country.id,
    country.country_name_eng
-- filter out only countries having an average call duration > average call duration of all calls
HAVING AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) > (SELECT AVG(DATEDIFF(SECOND, call.start_time, call.end_time)) FROM call)
ORDER BY calls DESC, country.id ASC;

`
