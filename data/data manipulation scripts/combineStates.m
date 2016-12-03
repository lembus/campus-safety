clear;clc;

states = {'HI', 'AK', 'FL', 'SC', 'GA', 'AL', 'NC', 'TN', 'RI', 'CT', 'MA',...
        'ME', 'NH', 'VT', 'NY', 'NJ', 'PA', 'DE', 'MD', 'WV', 'KY', 'OH',...
        'MI', 'WY', 'MT', 'ID', 'WA', 'DC', 'TX', 'CA', 'AZ', 'NV', 'UT',...
        'CO', 'NM', 'OR', 'ND', 'SD', 'NE', 'IA', 'MS', 'IN', 'IL', 'MN',...
        'WI', 'MO', 'AR', 'OK', 'KS', 'LA', 'VA'};
years = 2001:1:2014;
cell = {'year','state','size','CO','DA','HC','VW','total','totalRate'};
for j=1:length(years)
  for s=1:length(states)
    fid = fopen([states{s},'/crime_types.csv']);
    
    l=fgetl(fid);
    l=fgetl(fid);
    i=1;
    totalCO = 0;
    totalHC = 0;
    totalDA = 0;
    totalVW = 0;
    totalAll = 0;
    totalSize = 0;
    while (l~=-1)
      temp = textscan(l, '%s', 'Delimiter',',');
      if (temp{1}{1}==num2str(years(j)))
        totalCO = totalCO+ str2num(temp{1}{5});
        totalDA = totalDA+ str2num(temp{1}{6});
        totalHC = totalHC+ str2num(temp{1}{7});
        totalVW = totalVW+ str2num(temp{1}{8});
        totalAll = totalAll+ str2num(temp{1}{9});
        totalSize = totalSize+ str2num(temp{1}{4});
      end
      l=fgetl(fid);
      i = i +1;
    end
    cell = [cell;{years(j),states{s},totalSize,totalCO,totalDA,totalHC,totalVW,totalAll,totalAll/totalSize}];
    fclose(fid);
  end
end

fid = fopen('cumulativeData.csv', 'w') ;
fprintf(fid, '%s,', cell{1,1:end-1}) ;
fprintf(fid, '%s\n', cell{1,end}) ;

for i=2:length(cell)
  fprintf(fid, '%d,%s,%d,%d,%d,%d,%d,%d,%f\n', cell{i,:}) ;
end
fclose(fid) ;