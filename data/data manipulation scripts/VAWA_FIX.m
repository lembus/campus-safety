clear;clc;close all;

states = {'HI', 'AK', 'FL', 'SC', 'GA', 'AL', 'NC', 'TN', 'RI', 'CT', 'MA',...
        'ME', 'NH', 'VT', 'NY', 'NJ', 'PA', 'DE', 'MD', 'WV', 'KY', 'OH',...
        'MI', 'WY', 'MT', 'ID', 'WA', 'DC', 'TX', 'CA', 'AZ', 'NV', 'UT',...
        'CO', 'NM', 'OR', 'ND', 'SD', 'NE', 'IA', 'MS', 'IN', 'IL', 'MN',...
        'WI', 'MO', 'AR', 'OK', 'KS', 'LA', 'VA'};
years = 2001:1:2014;
  for s=1:length(states)
    cell = {'Survey year','Unitid','Institution name','Institution Size','Domestic violence','Dating violence','Stalking'};
    fid = fopen([states{s},'/VAWA_Offenses_On_campus_combined.csv']);
    l = fgetl (fid);
    l = fgetl (fid);
    while (l~=-1)
      temp = textscan(l, '%s', 'Delimiter',',');
      for i=1:14
        year=2000+i;
        cell = [cell;{year,str2num(temp{1}{2}),temp{1}{3},str2num(temp{1}{4}),str2num(temp{1}{5}),str2num(temp{1}{6}),str2num(temp{1}{7})}];
      end
      l=fgetl(fid);
    end
    fclose(fid);
    fid = fopen([states{s},'/VAWA_Offenses_On_campus_combined.csv'], 'w') ;
    fprintf(fid, '%s,', cell{1,1:end-1}) ;
    fprintf(fid, '%s\n', cell{1,end}) ;
    
    for i=2:length(cell)
      fprintf(fid, '%d,%d,%s,%d,%d,%d,%d\n', cell{i,:}) ;
    end
    fclose(fid) ;
    
  end

